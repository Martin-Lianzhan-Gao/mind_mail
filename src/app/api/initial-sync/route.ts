import { NextRequest, NextResponse } from "next/server";
import { Accout } from "~/lib/account";
import { db } from "~/server/db";
import { syncEmailsToDatabase } from "~/lib/sync-to-db";

// handle initial sync and following sync actions
export const POST = async (req: NextRequest) => { 
    // get data
    const { accountId, userId } = await req.json();
    // check whether data exists
    if (!accountId || !userId) {
        return NextResponse.json({
            message: "Missing account id or user id",
            status: 400 // bad request error code
        })
    }

    // check whether account exists in database
    const dbAccount = await db.account.findUnique({
        where: {
            id: accountId,
            userId
        }
    }); 
    // handle error
    if (!dbAccount) { 
        return NextResponse.json({
            message: "Account not found",
            status: 404 // not found error code
        })
    }

    // start sync
    const account = new Accout(dbAccount.accessToken);
    // perform initial sync to receive emails
    const response = await account.performInitialSync();
    // check response
    if (!response) { 
        return NextResponse.json({
            message: "Failed to perform initial sync",
            status: 500 // internal server error code
        });
    }
    // get returned email contents with latest delta token
    const { emails, latestDeltaToken } = response;

    // store latest delta token to account table
    await db.account.update({
        where: {
            id: accountId,
        },
        data: {
            latestDeltaToken: latestDeltaToken
        }
    });

    console.log("Latest Token has been stored to account, email upsert process start...");

    // upsert emails into database
    await syncEmailsToDatabase(emails, accountId as string);

    console.log("Emails Sync Successfully, with latest delta token:", latestDeltaToken); 

    return NextResponse.json({success: true}, { status: 200 });
}