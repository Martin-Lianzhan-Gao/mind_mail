// some configuration of the library "turndown"
import TurndownService from "turndown";

export const turndown = new TurndownService({
    headingStyle: 'atx', // use "#" to represent heading
    codeBlockStyle: 'fenced', // use "```" to wrap text that can be displayed as code block
    emDelimiter: '*', // use "*" to wrap text that can be displayed as italics
    strongDelimiter: '**', // use "**" to wrap text that can be displayed as bold
    bulletListMarker: '-', // use "-" to represent a bullet list
    linkStyle: 'inlined' // use "[]()" to wrap text that can be displayed as a link
    
})

// here are customized rules
// Remove link tags
turndown.addRule('linkRemover', {
    filter: 'a',
    replacement: (content) => content, // remove <a><a/>, keep and returns text content
});

// Remove style tags
turndown.addRule('styleRemover', {
    filter: 'style',
    replacement: () => '', // remove <style><style/>
});

// Remove script tags
turndown.addRule('scriptRemover', {
    filter: 'script',
    replacement: () => '', // remove <script><script/>
});

turndown.addRule('imageRemover', {
    filter: 'img',
    replacement: (content) => content, // remove <img><img/>, keep and returns text content
});