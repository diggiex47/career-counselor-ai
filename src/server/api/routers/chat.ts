// src/server/api/routers/chat.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { aiService, type AIMessage } from "~/server/services/ai";

export const chatRouter = createTRPCRouter({
  getMessages: protectedProcedure
    .input(z.object({ chatSessionId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Fetch messages for a specific chat session
      const messages = await ctx.db.message.findMany({
        where: {
          chatSessionId: input.chatSessionId,
          chatSession: {
            userId: ctx.session.user.id, // for security: Ensure user owns the session
          },
        },
        orderBy: {
          createdAt: "asc", // order messages chronologically
        },
      });
      return messages;
    }),

  sendMessage: protectedProcedure
    .input(z.object({ chatSessionId: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Save the user's message to the database immediately
      const userMessage = await ctx.db.message.create({
        data: {
          chatSessionId: input.chatSessionId,
          content: input.content,
          role: "user",
        },
      });

      // Get previous messages for context
      const previousMessages = await ctx.db.message.findMany({
        where: {
          chatSessionId: input.chatSessionId,
        },
        orderBy: {
          createdAt: "asc",
        },
        take: 10, // Limit to last 10 messages for context
      });

      // Convert to AI message format
      const conversationHistory: AIMessage[] = previousMessages.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

      try {
        // Generate AI response
        const aiResponse = await aiService.generateResponse(
          conversationHistory,
          {
            userId: ctx.session.user.id,
            sessionId: input.chatSessionId,
            previousMessages: conversationHistory,
          }
        );

        // Save AI response to database
        const aiMessage = await ctx.db.message.create({
          data: {
            chatSessionId: input.chatSessionId,
            content: aiResponse.content,
            role: "assistant",
            metadata: aiResponse.metadata,
          },
        });

        // Update session name if this is the first user message
        if (previousMessages.length === 1) { // Only user message exists
          const sessionName = await aiService.generateSessionName(input.content);
          await ctx.db.chatSession.update({
            where: { id: input.chatSessionId },
            data: { topic: sessionName },
          });
        }

        return { userMessage, aiMessage };
      } catch (error) {
        console.error("Error generating AI response:", error);
        
        // Return just the user message if AI fails
        return { userMessage, aiMessage: null };
      }
    }),
});
