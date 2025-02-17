'use client'
import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Text from "@tiptap/extension-text"
import EditorMenubar from "./editor-menubar";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import TagInput from "./tag-input";
import { Input } from "~/components/ui/input";

type Props = {
    // email subject and setter
    subject: string,
    setSubject: (value: string) => void,

    // value and setter of tag-input for "to"
    toValues: { label: string, value: string }[],
    setToValues: (values: { label: string, value: string }[]) => void,

    // value and setter of tag-input for "cc"
    ccValues: { label: string, value: string }[],
    setCCValues: (values: { label: string, value: string }[]) => void,

    to: string[],
    // send button required 
    handleSend: (value: string) => void,
    isSending: boolean

    defaultToolBarExpanded?: boolean
}

const EmailEditor = ({ subject, setSubject, toValues, setToValues, ccValues, setCCValues, to, handleSend, isSending, defaultToolBarExpanded }: Props) => { 
    // editor value
    const [value, setValue] = React.useState<string>('');
    // expand state to control the expand / hide of contact components
    const [expanded, setExpanded] = React.useState<boolean>(defaultToolBarExpanded ?? false);

    // custom extension
    const CustomText = Text.extend({
        addKeyboardShortcuts() { // define keyboard shortcuts
            return {
                // press Cmd + j on Mac or Ctrl + j on Windows to execute
                'Meta-j': () => {
                    console.log("Meta-j pressed")
                    return true
                }
            }
        }
    })

    // initialise editor
    const editor = useEditor({
        autofocus: false,
        extensions: [
            StarterKit, // common operations like bold and underline, etc
            CustomText
        ],
        onUpdate: ({ editor }) => {
            // set value as the html version of the editor content 
            setValue(editor.getHTML())
        }
    })

    // check editor existence
    if (!editor) { 
        return null;
    }

    return (
        <div>
            <div className="flex p-4 py-2 border-b">
                <EditorMenubar editor={editor} />
            </div>
            { /* Contact Components */}
            { /* CC Component */}
            <div className="p-4 pb-0 space-y-2">
                {expanded && (
                    <>
                        <TagInput
                            label="To"
                            onChange={setToValues}
                            placeholder="Add recipent(s)"
                            value={toValues}
                        />
                        <TagInput
                            label="CC"
                            onChange={setCCValues}
                            placeholder="Carbon copy to contact(s)"
                            value={ccValues}
                        />
                        <Input
                            id="subject"
                            placeholder="Subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </>    
                ) }
            </div>
            {/* Click-able text to expand / hide contact components */}
            <div className="flex items-center gap-2">
                <div className="cursor-pointer" onClick={() => { setExpanded(!expanded) }}>
                    <span className="text-green-600 font-medium">Draft {" "}</span>
                    <span>to {to.join(", ")}</span>
                </div>
            </div>
            
            <div className="prose w-full px-4">
                <EditorContent editor={editor} value={value} />
            </div>
            <Separator />
            { /* AI auto complete Hint */}
            <div className="py-3 px-4 flex items-center justify-between">
                <span className="text-sm">
                    Tip: Press{" "}
                    <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
                        Cmd + J
                    </kbd>{" "}
                    for AI autocomplete
                </span>
                <Button onClick={async () => {
                    // clear editor content
                    editor?.commands?.clearContent()
                    // send editor value
                    // await handleSend(value)
                }}>
                    Send
                </Button>
            </div>
        </div>
    )
}

export default EmailEditor;