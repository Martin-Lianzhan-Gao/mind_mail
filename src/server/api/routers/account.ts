import { get } from "http";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
import z from "zod";
import { db } from "~/server/db";
import { Prisma } from "@prisma/client";
import { fileURLToPath } from "url";

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

        // filter by the currently selected tab category for Thread model
        const filter: Prisma.ThreadWhereInput = {}

        if (input.tabCategory === "inbox") {
            filter.inboxStatus = true;
        } else if (input.tabCategory === "sent") {
            filter.sentStatus = true;
        } else if (input.tabCategory === "draft") {
            filter.draftStatus = true;
        }
        // get and return thread count
        return await ctx.db.thread.count({
            where: {
                accountId: account.id,
                // Add filter here to get relevant thread count
                ...filter
            }
        })
    }),
    // get threads list by category (inbox, sent, draft, etc..) and status (done or not)
    getThreads: privateProcedure.input(z.object({
        accountId: z.string(),
        tabCategory: z.string(),
        done: z.boolean() // thread status
    })).query(async ({ input, ctx }) => { 
        const account = await authoriseAccountAccess(input.accountId, ctx.auth.userId);

        // filter by the currently selected tab category for Thread model
        const filter: Prisma.ThreadWhereInput = {}

        if (input.tabCategory === "inbox") {
            filter.inboxStatus = true;
        } else if (input.tabCategory === "sent") {
            filter.sentStatus = true;
        } else if (input.tabCategory === "draft") {
            filter.draftStatus = true;
        }

        filter.done = {
            equals: input.done
        }

        return await ctx.db.thread.findMany({
            where: filter,
            include: {
                emails: {
                    orderBy: {
                        //  emails in asceding order
                        sentAt: "asc"
                    },
                    select: {
                        from: true,
                        body: true,
                        bodySnippet: true,
                        emailLabel: true,
                        subject: true,
                        sysLabels: true,
                        id: true,
                        sentAt: true
                    }
                }
            },
            // only get latest 15 threads
            take: 15,
            orderBy: {
                // threads in descending order
                lastMessageDate: "desc"
            }
        }) 
    }) 
});