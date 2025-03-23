import { db } from "~/server/db";
import { turndown } from "./turndown";

export async function searchEmails(accountId: string, term: string) {
    const emails = await db.email.findMany({
        where: {
            thread: {
                accountId
            },
            OR: [
                { subject: { contains: term, mode: 'insensitive' } },
                { body: { contains: term, mode: 'insensitive' } },
                { bodySnippet: { contains: term, mode: 'insensitive' } },
            ]
        },
        select: {
            id: true,
            subject: true,
            body: true,
            bodySnippet: true,
            from: true,
            sentAt: true,
            to: true,
            threadId: true
        },
        take: 60,
        orderBy: {
            // threads in descending order
            sentAt: "desc"
        }
    })

    const results: {
        id: string,
        subject: string,
        body: string,
        rawBody: string,
        from: string,
        to: string[],
        sentAt: string,
        threadId: string
    }[] = [];

    for (const email of emails) { 
        const body = turndown.turndown(email.body ?? email.bodySnippet ?? "");
        
        if (body.toLowerCase().includes(term.toLowerCase()) || email.subject.toLowerCase().includes(term.toLowerCase()) || email.bodySnippet?.toLowerCase().includes(term.toLowerCase())) {
            results.push(
                {
                    id: email.id,
                    subject: email.subject,
                    body: body,
                    rawBody: email.bodySnippet ?? "",
                    from: email.from.address,
                    to: email.to.map(to => to.address),
                    sentAt: email.sentAt.toLocaleString(),
                    threadId: email.threadId
                }
            )            
        }
    }   

    return results;
}

