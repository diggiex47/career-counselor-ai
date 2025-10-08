// src/server/api/routers/chat.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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

  sendMessage: protectedProcedure // I renamed this to match my previous example, it's a better name
    .input(z.object({ chatSessionId: z.string(), content: z.string() })) // 👈 FIX: Changed to camelCase 'chatSessionId'
    .mutation(async ({ ctx, input }) => {
      // save the user's message to the database
      const userMessage = await ctx.db.message.create({
        data: {
          chatSessionId: input.chatSessionId, // 👈 FIX: This now matches the input
          content: input.content,
          role: "user",
        },
      });

      // in future AI response will be generated here
      // for now, we'll just return the user's message

      return userMessage;
    }),
});
