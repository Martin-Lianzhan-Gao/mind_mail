'use client';
import React from "react";
import { Button } from "./button";
import { getAurinkoAuthURL } from "~/lib/aurinko";
import { Mail } from "lucide-react";

// used to link a user's email account by Aurinko
const LinkAccountButton = () => {
    return (
        <Button onClick={async () => { 
            // get the authentication url
            const authUrl = await getAurinkoAuthURL('Google');
            // redirect to the authentication url
            window.location.href = authUrl;
        }} className="font-notoSans font-light text-[20px] py-7 px-5 hover:bg-[#3d3d3d] dark:bg-[#E7E4DF] dark:hover:bg-[#cccccc]  rounded-full">
            <Mail className="mr-2" size={48} />
            Link Account
        </Button>
    )
}

export default LinkAccountButton;