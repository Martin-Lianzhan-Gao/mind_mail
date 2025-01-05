import axios from "axios";
import { headers } from "next/headers";
import { SyncResponse, SyncUpdatedEmailsReponse, EmailMessage } from "~/type";

export class Accout {
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
        let params: Record<string, string> = {};

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
            let updatedResponse = await this.getUpdatedEmails({ deltaToken });
            // get nextDeltaToken, always track the latest one
            if (updatedResponse.nextPageToken) {
                deltaToken = updatedResponse.nextDeltaToken;
            }
            // store returned email contents
            let allEmails: EmailMessage[] = updatedResponse.records;

            // while there is a next page
            while (updatedResponse.nextPageToken) { 
                let updatedReponse = await this.getUpdatedEmails({ pageToken: updatedResponse.nextPageToken });
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
}