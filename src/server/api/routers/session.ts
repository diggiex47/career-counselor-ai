import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const sessionRouter = createTRPCRouter({
  // fetches all chat sessions for the current logged-in user.
  getAllSessions: protectedProcedure.query(async ({ ctx }) => {
    try {
      const sessions = await ctx.db.chatSession.findMany({
        where: {
          userId: ctx.session.user.id, // security: only fetch sessions for the logged-in user
        },
        orderBy: {
          createdAt: "desc", // show the newest sessions first for better ux
        },
      });
      return sessions;
    } catch (e) {
      console.error("failed to get all sessions:", e);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch chat sessions",
      });
    }
  }),

  // create a new, empty chat session for the current user.

  createSession: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const newSession = await ctx.db.chatSession.create({
        data: {
          userId: ctx.session.user.id, // link the session to the current user
        },
      });
      return newSession; // the frontend will user the ID from this object to redirect
    } catch (e) {
      console.error("Failed to create session:", e);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create chat session",
      });
    }
  }),

  // update the topic/name of a chat session for the current user.
  updateSessionName: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
        topic: z.string().min(1).max(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // First verify the session belongs to the current user
        const session = await ctx.db.chatSession.findFirst({
          where: {
            id: input.sessionId,
            userId: ctx.session.user.id, // security: ensure user owns the session
          },
        });

        if (!session) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message:
              "Chat session not found or you don't have permission to update it",
          });
        }

        // Update the session topic
        const updatedSession = await ctx.db.chatSession.update({
          where: {
            id: input.sessionId,
          },
          data: {
            topic: input.topic,
          },
        });

        return updatedSession;
      } catch (e) {
        console.error("Failed to update session name:", e);
        if (e instanceof TRPCError) {
          throw e;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update session name",
        });
      }
    }),

  // delete a chat session and all its messages for the current user.

  deleteSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // First verify the session belongs to the current user
        const session = await ctx.db.chatSession.findFirst({
          where: {
            id: input.sessionId,
            userId: ctx.session.user.id, // security: ensure user owns the session
          },
        });

        if (!session) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message:
              "Chat session not found or you don't have permission to delete it",
          });
        }

        // Delete the session (messages will be deleted automatically due to cascade)
        await ctx.db.chatSession.delete({
          where: {
            id: input.sessionId,
          },
        });

        return { success: true, deletedSessionId: input.sessionId };
      } catch (e) {
        console.error("Failed to delete session:", e);
        if (e instanceof TRPCError) {
          throw e;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete chat session",
        });
      }
    }),
});
