'use client' // you must use client component if you want to use dynamic import
import { UserButton } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import React from "react";
import ThemeToggle from "~/components/theme-toggle";
import ComposeButton from "./components/compose-button";

// import Mail from "./mail";

// use dynamic import to avoid hydration issue caused by ssr
// also, lazy load the mail component (that's the main usage of dynamic import)
const Mail = dynamic(() => { 
    return import("./mail")
}, {
    ssr: false
})

const MailDashboard = () => { 
    return (
        <>
            <div className="absolute bottom-4 left-4">
                <div className="flex items-center gap-2 z-10">
                    <UserButton />
                    <ThemeToggle />
                    <ComposeButton />
                </div>
            </div>
            <Mail defaultLayout={[20, 32, 48]} defaultCollapsed={false} navCollapseSize={4} />
        </>

    )
}


export default MailDashboard;