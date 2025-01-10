import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
import z from "zod";
import { db } from "~/server/db";

// based on user id and account id, find matched account (whether the user has the account or not)
export const authoriseAccountAccess = async (accountId: string, userId: string) => { 

    const account = await db.account.findFirst({
        where: {
            id: accountId,
            userId
        }, select: {
            id: true,
            emailAddress: true,
            name: true,
            accessToken: true
        }
    })

    if (!account) { 
        throw new Error("Account not found");
    }

    return account;
}

export const accountRouter = createTRPCRouter({

    getAccounts: privateProcedure.query(async ({ ctx }) => { 
        return ctx.db.account.findMany({
            where: {
                userId: ctx.auth.userId
            },
            select: {
                id: true,
                emailAddress: true,
                name: true
            }
        });
    }),
    // get number of threads by category (inbox, sent, draft, etc..)
    getNumThreads: privateProcedure.input(z.object({
        accountId: z.string(),
        tabCategory: z.string()
    })).query(async ({ input, ctx }) => { 
        
        const account = await authoriseAccountAccess(input.accountId, ctx.auth.userId);

        // get and return thread count
        return await ctx.db.thread.count({
            where: {
                accountId: account.id,
                // filter by the currently selected tab category
                inboxStatus: input.tabCategory === "inbox" ? true : false,
                sentStatus: input.tabCategory === "sent" ? true : false,
                draftStatus: input.tabCategory === "draft" ? true : false
            }
        })
    }) 

});