import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";

export const userRouter = createTRPCRouter({
  // Get current user profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return user;
  }),

  // Update user name
  updateName: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required").max(100, "Name too long"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { name: input.name },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      return updatedUser;
    }),

  // Update user password (for credential-based auth)
  updatePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z
          .string()
          .min(8, "Password must be at least 8 characters")
          .max(100, "Password too long"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        include: { accounts: true },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Check if user has OAuth accounts (Google, GitHub, etc.)
      const hasOAuthAccount = user.accounts.some(
        (account) => account.type === "oauth",
      );

      if (hasOAuthAccount && !user.password) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Password changes are not available for OAuth-only accounts. Please manage your password through your OAuth provider.",
        });
      }

      // For users with passwords (credential-based or mixed auth)
      if (user.password) {
        const isCurrentPasswordValid = await bcrypt.compare(
          input.currentPassword,
          user.password
        );

        if (!isCurrentPasswordValid) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Current password is incorrect",
          });
        }
      }

      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(input.newPassword, 12);

      // Update the password
      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { password: hashedNewPassword },
      });

      return { message: "Password updated successfully" };
    }),
});