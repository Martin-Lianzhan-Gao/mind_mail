import axios from "axios";
import { db } from "~/server/db";
import { SyncResponse, SyncUpdatedEmailsReponse, EmailMessage, EmailAddress, emailAddressSchema } from "~/type";
import { syncEmailsToDatabase } from "./sync-to-db";

export class Account {
    // the token represents the email account
    private token: string;
    
    constructor(token: string) {
        // assign token value
        this.token = token;
    }

    // Start sync by requesting deltaToken through Aurinko api
    private async startSync() {
        // send request
        const response = await axios.post<SyncResponse>("https://api.aurinko.io/v1/email/sync", {}, {
            headers: { // header for authorization 
                Authorization: `Bearer ${this.token}`
            },
            params: { // parameters
                daysWithin: 2,
                bodyType: "html" // email content in html version 
            }
        })
        return response.data;
    }

    /**
     * Get updated emails data. 
     * If deltaToken is provided, it is used to get the next delta token. 
     * If pageToken is provided, it is used to get the next page of emails.
     * 
     * @param {{ deltaToken?: string, pageToken?: string }} - The params object.
     * 
     * @returns {Promise<SyncUpdatedEmailsReponse>} - The response data from the api.
     */
    async getUpdatedEmails({ deltaToken, pageToken }: { deltaToken?: string, pageToken?: string }) {
        // receive deltaToken and pageToken by a project
        const params: Record<string, string> = {};

        // store value into params if exists
        if (deltaToken) {
            params.deltaToken = deltaToken;
        }
        if (pageToken) { 
            params.pageToken = pageToken;
        }

        // request for nextDeltaToken, nextPageToken and return email contents
        const response = await axios.get<SyncUpdatedEmailsReponse>("https://api.aurinko.io/v1/email/sync/updated", {
            headers: {
                Authorization: `Bearer ${this.token}`
            },
            params
        });

        return response.data;
    }

    // perform initial sync and get emails
    async performInitialSync() { 
        try {
            // start sync process
            let syncResponse = await this.startSync();
            // if not ready, keep requesting until success
            while (!syncResponse.ready) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                syncResponse = await this.startSync();
            }
            // get delta token
            let deltaToken = syncResponse.syncUpdatedToken;

            // get updated emails content (maybe more than one page)
            const updatedResponse = await this.getUpdatedEmails({ deltaToken });
            // get nextDeltaToken, always track the latest one
            if (updatedResponse.nextPageToken) {
                deltaToken = updatedResponse.nextDeltaToken;
            }
            // store returned email contents
            let allEmails: EmailMessage[] = updatedResponse.records;

            // while there is a next page
            while (updatedResponse.nextPageToken) { 
                const updatedReponse = await this.getUpdatedEmails({ pageToken: updatedResponse.nextPageToken });
                // always keep the latest delta token
                if (updatedReponse.nextPageToken) { 
                    deltaToken = updatedReponse.nextDeltaToken;
                }
                // store returned email contents
                allEmails = allEmails.concat(updatedReponse.records);
            }

            console.log("Initial sync done, got total emails:", allEmails.length, "waiting to upsert to database...");

            // return latest delta token with all emails in the first sync (initial sync)
            return {
                latestDeltaToken: deltaToken,
                emails: allEmails
            }
        
        } catch (error) {
            // handle error
            if (axios.isAxiosError(error)) { // axios error
                console.error("Error during initial sync", JSON.stringify(error.response?.data));
            } else { // other error
                console.error("Error during initial sync", error);
            }
        }
    }

    // send email
    async sendEmail({ 
        from, // sender
        to, // recipents
        cc, 
        bcc,
        replyTo, // eamil address that 
        subject,
        body,
        inReplyTo, // internet message id
        references, 
        threadId
    }: { 
        from: EmailAddress,
        to: EmailAddress[],
        cc?: EmailAddress[],
        bcc?: EmailAddress[],
        replyTo?: EmailAddress
        subject: string,
        body: string,
        inReplyTo?: string, 
        references?: string,
        threadId?: string
    }) { 
        try {
            // console.log("Carbon copy:", cc)
            const response = await axios.post("https://api.aurinko.io/v1/email/messages", {
                from,
                to,
                cc,
                bcc,
                replyTo: [replyTo], // actually we only support one replyTo list
                subject,
                body,
                inReplyTo,
                references,
                threadId
            }, {
                params: {
                    returnIds: true
                },
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            });
            console.log("Eamil sent:", response.data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error sending email", JSON.stringify(error.response?.data));
            } else { 
                console.error("Error sending email", error); 
            }
            throw error;
        }
    }

    async syncEmails() { 
        const account = await db.account.findUnique({
            where: {
                accessToken: this.token
            }
        });
        // check account and latest delta token
        if (!account) { 
            throw new Error("Account not found");
        }
        if (!account.latestDeltaToken) { 
            throw new Error("Account not ready for sync");
        }
        // request for updated emails by latest delta token
        let response = await this.getUpdatedEmails({ deltaToken: account.latestDeltaToken });
        let storedDeltaToken = account.latestDeltaToken;
        // get all updated emails
        let allEmails: EmailMessage[] = response.records;
        // hold temporary latest delta token
        if (response.nextDeltaToken) { 
            storedDeltaToken = response.nextDeltaToken;
        }
        // update emails until no page (up to date)
        while (response.nextPageToken) { 
            response = await this.getUpdatedEmails({ pageToken: response.nextPageToken });
            // continously update delta token until the latest one
            if (response.nextDeltaToken) { 
                storedDeltaToken = response.nextDeltaToken;
            }
            allEmails = allEmails.concat(response.records);
        }
        // sync all updated emails to database
        try {
            syncEmailsToDatabase(allEmails, account.id);
        } catch (error) {
            console.error("Error syncing emails", error);
        }

        // update latest delta token to account table
        await db.account.update({
            where: {
                id: account.id
            },
            data: {
                latestDeltaToken: storedDeltaToken
            }
        })

        return {
            emails: allEmails,
            latestDeltaToken: storedDeltaToken
        }
    }
}