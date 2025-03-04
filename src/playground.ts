// for TESTING purposes ONLY

import { Account } from "./lib/account";

// copied from db
const accessToken = "eXiQ_E2KFlSVxDfdJL8QeaScHOee_M0MkdKCXA9O07o"

const account = new Account(accessToken);

await account.syncEmails(); // sync emails to database