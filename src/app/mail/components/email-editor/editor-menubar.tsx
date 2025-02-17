
import React from "react";
import { type Editor } from "@tiptap/react"
import { BoldIcon, Code, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, Italic, List, ListOrdered, Quote, Redo, Strikethrough, Undo } from "lucide-react";

type Props = {
    editor : Editor
}

const EditorMenubar = ({editor} : Props) => { 
    return (
        <div className="flex flex-wrap gap-2">
            { /* Bold Button */}
            <button
                onClick={() => {
                    // run a command chain, toggle bold status based on focus
                    editor.chain().focus().toggleBold().run();
                }}
                // disable button if editor cannot bold text
                disabled={!editor.can().chain().focus().toggleBold().run()}
                // apply is-active (in global.css) class if the button is active
                className={ editor.isActive('bold') ? 'is-active' : ''}
            > 
                <BoldIcon className="size-5 text-secondary-foreground" />
            </button>
            { /* Italic Button */}
            <button
                onClick={() => {
                    // run a command chain, toggle italic status based on focus
                    editor.chain().focus().toggleItalic().run();
                }}
                // disable button if editor cannot italic text
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                // apply is-active (in global.css) class if the button is active
                className={editor.isActive('italic') ? 'is-active' : ''}
            >
                <Italic className="size-5 text-secondary-foreground" />
            </button>
            { /* Strike Button */ }
            <button
                onClick={() => {
                    // run a command chain, toggle strike status based on focus
                    editor.chain().focus().toggleStrike().run();
                }}
                // disable button if editor cannot strike text
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                // apply is-active (in global.css) class if the button is active
                className={editor.isActive('strike') ? 'is-active' : ''}
            >
                <Strikethrough className="size-5 text-secondary-foreground" />
            </button>
            { /* Code Button */ }
            <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                disabled={!editor.can().chain().focus().toggleCode().run()}
                className={editor.isActive("code") ? "is-active" : ""}
            >
                <Code className="size-5 text-secondary-foreground" />
            </button>
            <button
                onClick={() => {editor.chain().focus().toggleHeading({ level: 1 }).run()}}
                className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
            
            >
                <Heading1 className="size-5 text-secondary-foreground" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
            >
                <Heading2 className="size-5 text-secondary-foreground" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
            >
                <Heading3 className="size-5 text-secondary-foreground" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                className={editor.isActive("heading", { level: 4 }) ? "is-active" : ""}
            >
                <Heading4 className="size-5 text-secondary-foreground" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                className={editor.isActive("heading", { level: 5 }) ? "is-active" : ""}
            >
                <Heading5 className="size-5 text-secondary-foreground" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                className={editor.isActive("heading", { level: 6 }) ? "is-active" : ""}
            >
                <Heading6 className="size-5 text-secondary-foreground" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive("bulletList") ? "is-active" : ""}
            >
                <List className="size-5 text-secondary-foreground" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive("orderedList") ? "is-active" : ""}
            >
                <ListOrdered className="size-5 text-secondary-foreground" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive("blockquote") ? "is-active" : ""}
            >
                <Quote className="size-5 text-secondary-foreground" />
            </button>
            <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
            >
                <Undo className="size-5 text-secondary-foreground" />
            </button>
            <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
            >
                <Redo className="size-5 text-secondary-foreground" />
            </button>
        </div>
    )
}

export default EditorMenubar;