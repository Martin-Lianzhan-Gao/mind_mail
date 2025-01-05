import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";

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
    })

});