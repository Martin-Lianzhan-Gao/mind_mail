import type { NextRequest } from "next/server";
import { db } from "~/server/db";

// handle new users while received from Clerk
export const POST = async (req: NextRequest) => { 
    const data = await req.json();

    const id = data.data.id;
    const emailAddress = data.data.email_addresses[0].email_address;
    const firstName = data.data.first_name ?? data.data.email_addresses[0].email_address;
    const lastName = data.data.last_name ?? "";
    const imageUrl = data.data.image_url;

    await db.user.upsert({
        where: { id },
        update: { emailAddress, firstName, lastName, imageUrl },
        create: { id, emailAddress, firstName, lastName, imageUrl }
    });

    console.log("User created successfully!");

    return new Response("Webhook received data successfully!", { status: 200 });
 
}