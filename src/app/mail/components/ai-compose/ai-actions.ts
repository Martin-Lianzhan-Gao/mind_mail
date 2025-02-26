'use server'

import { streamText } from 'ai'
import { createStreamableValue } from 'ai/rsc'
import { google } from '@ai-sdk/google'

const generateEmail = async (context: string, prompt: string) => {

    console.log('Context: ', context);

    const stream = createStreamableValue('');

    (async () => {
        // use AI API KEY in .env and generate result
        const { textStream } = await streamText({
            model: google('gemini-2.0-flash-001'),
            prompt: `
            You are an AI email assistant embedded in an email client app. Your purpose is to help the user compose emails by providing suggestions and relevant information based on the context of their previous emails.
            
            THE TIME NOW IS ${new Date().toLocaleString()}
            
            START CONTEXT BLOCK
            ${context}
            END OF CONTEXT BLOCK
            
            USER PROMPT:
            ${prompt}
            
            When responding, please keep in mind:
            - Be helpful, clever, and articulate. 
            - Rely on the provided email context to inform your response.
            - If the context does not contain enough information to fully address the prompt, politely give a draft response.
            - Avoid apologizing for previous responses. Instead, indicate that you have updated your knowledge based on new information.
            - Do not invent or speculate about anything that is not directly supported by the email context.
            - Keep your response focused and relevant to the user's prompt.
            - Don't add fluff like 'Heres your email' or 'Here's your email' or anything like that.
            - Directly output the email, no need to say 'Here is your email' or anything like that.
            - No need to output subject
            - No need to output any other information except the email.
            `,
        });

        // update result into stream
        for await (const snippet of textStream) {
            stream.update(snippet);
        }

        // finalise stream transmission
        stream.done();
    })();

    return { output: stream.value };

}

export default generateEmail;

