'use client'
import React from "react";
import { useLocalStorage } from "usehooks-ts";
import { Nav } from "./nav";
import { File, Inbox, Send } from "lucide-react";

type Props = {

    isCollapsed: boolean

};

const Sidebar = ({ isCollapsed }: Props) => { 
    
    // account id from local storage, READ-ONLY
    const [accountId] = useLocalStorage('accountId', '');
    // get value from local storage
    const [tab] = useLocalStorage<"inbox" | "sent" | "draft">("tab-category", "inbox");

    return (
        <div suppressHydrationWarning={ true }>
            <Nav
                isCollapsed={isCollapsed}
                links={[
                    {
                        title: "Inbox",
                        label: '6',
                        icon: Inbox,
                        variant: tab === "inbox" ? "default" : "ghost"
                    },
                    {
                        title: "Draft",
                        label: '9',
                        icon: File,
                        variant: tab === "draft" ? "default" : "ghost"
                    },
                    {
                        title: "Sent",
                        label: '12',
                        icon: Send,
                        variant: tab === "sent" ? "default" : "ghost"
                    }
                ]}
            />
        </div>
    )
}

export default Sidebar;