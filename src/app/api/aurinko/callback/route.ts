import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForAccessToken, getAccountDetails } from "~/lib/aurinko";
import { db } from "~/server/db";
import { waitUntil } from "@vercel/functions";
import axios from "axios";

// handle account token after received from Aurinko
export const GET = async (req: NextRequest) => {
    // check user login status first
    const { userId } = await auth();
    if (!userId) { 
        return NextResponse.json({
            message: "Unauthorized",
            status: 401 // unauthorized error code
        })
    };

    // get return params from Aurinko
    const params = req.nextUrl.searchParams;

    // get status
    const status = params.get("status");
    // check wehether it is success
    if (status !== "success") {
        return NextResponse.json({
            message: "Authorization failed",
            status: 403 // forbidden error code
        })
    };

    // get code for exchange token
    const code = params.get("code");
    
    // check whether code exists
    if (!code) {
        return NextResponse.json({
            message: "No code received",
            status: 400 // bad request error code
        })
    };
    // exchange code for token
    const token = await exchangeCodeForAccessToken(code as string);
    // check whether token exists
    if (!token) {
        return NextResponse.json({
            message:"Failed to exchange code for access token."
        });
    }

    console.log(token);
    // get account details
    const accountDetails = await getAccountDetails(token.accessToken);

    // save details to database
    // "upsert": if no record, insert it. Otherwise update it if exists, e.g.update new access token
    await db.account.upsert({
        where: { // check if record exists by account id
            id: token.accountId.toString()
        },
        update: { // if exists, update
            accessToken: token.accessToken,
        },
        create: { // otherwise insert new record into db
            id: token.accountId.toString(),
            userId,
            emailAddress: accountDetails.email,
            name: accountDetails.name,
            accessToken: token.accessToken
        }
    });

    // trigger initial sync endpoint, this will run in background
    waitUntil(
        // transfer data to endpoint
        axios.post(`${process.env.NEXT_PUBLIC_URL}/api/initial-sync`, {
            accountId: token.accountId.toString(),
            userId
        }).then(response => {
            // success notification
            console.log("Initial Sync Triggered", response.data);
        }).catch(error => {
            // handle error
            console.error("Failed to trigger initial sync", error);
        })
    );

    // redirect to mail page once authorizationis done, under the same domain as request url
    return NextResponse.redirect(new URL("/mail", req.url));
}