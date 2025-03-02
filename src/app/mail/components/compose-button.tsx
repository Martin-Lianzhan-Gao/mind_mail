'use client'

import { Pencil } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "~/components/ui/drawer"
import EmailEditor from "./email-editor/email-editor";

 
const ComposeButton = () => { 

    // email toValues and it's setter
    const [toValues, setToValues] = React.useState<{ label: string, value: string }[]>([])
    // email ccValues and it's setter
    const [ccValues, setCcValues] = React.useState<{ label: string, value: string }[]>([])
    // email subject and it's setter
    const [subject, setSubject] = React.useState<string>('');
    
    const handleSend = (value: string) => { 
        console.log("Value", value);
    }   



    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button>
                    <Pencil className="size-4 mr-1"/>
                    Compose
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Compose a new email</DrawerTitle>
                </DrawerHeader>
                <EmailEditor
                    toValues={toValues}
                    setToValues={setToValues}
                    ccValues={ccValues}
                    setCCValues={setCcValues}
                    subject={subject}
                    setSubject={setSubject}
                    to={toValues.map(to => to.value)}

                    defaultToolBarExpanded={true}

                    handleSend={handleSend}
                    isSending={false}
                />
            </DrawerContent>
        </Drawer>
    )
}

export default ComposeButton;