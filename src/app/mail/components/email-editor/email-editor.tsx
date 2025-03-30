'use client'
import React, { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Text from "@tiptap/extension-text"
import EditorMenubar from "./editor-menubar";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import TagInput from "./tag-input";
import { Input } from "~/components/ui/input";
import AIComposeBotton from "../ai-compose/ai-compose-botton";
import { autoAIComplete } from "../ai-compose/ai-actions";
import { readStreamableValue } from "ai/rsc";
import { set } from "date-fns";

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

    defaultToolBarExpanded: boolean
}

const EmailEditor = ({ subject, setSubject, toValues, setToValues, ccValues, setCCValues, to, handleSend, isSending, defaultToolBarExpanded }: Props) => { 
    // editor value in HTML format (final version), need to be sent to receiver after user finished all editing
    const [value, setValue] = React.useState<string>('');
    // expand state to control the expand / hide of contact components
    const [expanded, setExpanded] = React.useState<boolean>(defaultToolBarExpanded ?? false);
    // editor autocomplete text snippet by AI
    const [snippet, setSnippet] = React.useState<string>('');

    // auto complete email content based on current editor value
    const autoComplete = async(value: string) => { 
        const { output } = await autoAIComplete(value);

        for await (const snippet of readStreamableValue(output)) {
            if (snippet) { 
                setSnippet(snippet);
            }
        } 
    }

    // custom extension
    const CustomText = Text.extend({
        addKeyboardShortcuts() { // define keyboard shortcuts
            return {
                // press Cmd + j on Mac or Ctrl + j on Windows to execute
                'Meta-j': () => {
                    // call autoComplete function
                    autoComplete(this.editor.getText())
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

    // update autocomplete text snippet to editor content
    useEffect(() => {
        editor?.commands.insertContent(snippet);
    }, [editor, snippet])

    // check editor existence
    if (!editor) { 
        return null;
    }

    function onGenerate(token: string): void {
        // console.log(token);
        editor?.commands?.insertContent(token);
    }

    return (
        <div>
            <div className="flex p-4 py-2 border-b">
                <EditorMenubar editor={editor} />
            </div>
            { /* Contact Components */}
            { /* CC Component */}
            <div className="p-4 pb-0 space-y-2 shadow">
                {expanded && (
                    <>
                        <TagInput
                            label="TO"
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
                )}
                {/* Click-able text to expand / hide contact components */}
                <div className="flex items-center gap-2 pb-4">
                    <div className="cursor-pointer">
                        <span className="text-green-600 font-medium" onClick={() => { setExpanded(!expanded) }}>Draft {" "}</span>
                        <span>to {to.join(", ")}</span>
                    </div>
                    <AIComposeBotton isComposing={defaultToolBarExpanded} onGenerate={onGenerate} />
                </div>
            </div>
            <div className="w-full px-4 mt-2">
                <EditorContent editor={editor} value={value} className="h-[220px] overflow-auto" />
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
                    // send editor value (generated by AI)
                    await handleSend(value)
                }}>
                    Send
                </Button>
            </div>
        </div>
    )
}

export default EmailEditor;