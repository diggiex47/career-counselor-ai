import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

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
});
