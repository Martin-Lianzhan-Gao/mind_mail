// a custom hook to read threads from db based on states stored in local storage
import React from "react";
import { useLocalStorage } from "usehooks-ts";
import { api } from "~/trpc/react";
 
const useThreads = () => { 
    const { data: accounts } = api.account.getAccounts.useQuery();
    const [accountId] = useLocalStorage('accountId', '');
    const [tabCategory] = useLocalStorage<"inbox" | "sent" | "draft">("tab-category", "inbox");
    const [done] = useLocalStorage("thread-done", false);

    const { data: threads } = api.account.getThreads.useQuery({
        accountId,
        tabCategory,
        done
    }, {
        // set placeholder data if accountId and tabCategory is not null
        enabled: !!accountId && !!tabCategory, placeholderData: e => e
    })

    return threads

}

export default useThreads