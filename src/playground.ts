
import { searchEmails } from "./lib/search";

const searchResults = await searchEmails("93500", "test")

console.log(searchResults.length);

for (const email of searchResults) { 
    console.log(email.subject)
}

