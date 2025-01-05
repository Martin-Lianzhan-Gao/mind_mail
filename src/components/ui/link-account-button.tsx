'use client';
import React from "react";
import { Button } from "./button";
import { getAurinkoAuthURL } from "~/lib/aurinko";

// used to link a user's email account by Aurinko
const LinkAccountButton = () => {
    return (
        <Button onClick={async () => { 
            // get the authentication url
            const authUrl = await getAurinkoAuthURL('Google');
            // redirect to the authentication url
            window.location.href = authUrl;
        }}>Link Account</Button>
    )
}

export default LinkAccountButton;