import { NextRequest } from "next/server";
import { db } from "~/server/db";

export const POST = async (req: NextRequest) => { 
    const data = await req.json();

    const id = data.data.id;
    const emailAddress = data.data.email_addresses[0].email_address;
    const firstName = data.data.first_name;
    const lastName = data.data.last_name;
    const imageUrl = data.data.image_url;

    await db.user.create({
        data: {
            id: id,
            emailAddress: emailAddress,
            firstName: firstName,
            lastName: lastName,
            imageUrl: imageUrl,
        },
    });

    console.log("User created successfully!");

    return new Response("Webhook received data successfully!", { status: 200 });
 
}