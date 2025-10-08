import { chatRouter } from "./routers/chat";
import { sessionRouter } from "./routers/session";
import { createTRPCRouter } from "~/server/api/trpc";

/** 
 * this is the root router of our tRPC api.
 * 
 * All routers added in /api/routers should be manually added here.
 */

export const appRouter = createTRPCRouter({
    chat: chatRouter,
    session: sessionRouter,
});

export type AppRouter = typeof appRouter;