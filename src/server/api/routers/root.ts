import { chatRouter } from "./chat";
import { sessionRouter } from "./session";
import { userRouter } from "./user";
import { createTRPCRouter } from "~/server/api/trpc";

/** 
 * this is the root router of our tRPC api.
 * 
 * All routers added in /api/routers should be manually added here.
 */

export const appRouter = createTRPCRouter({
    chat: chatRouter,
    session: sessionRouter,
    user: userRouter,
});

export type AppRouter = typeof appRouter;