import type { MSConfiguration } from "@smals-jy/kmehr-tests";
type TransactionConfig = MSConfiguration['transactions'][number];

import TS08THERAPEUTIC_SUSPENSIONS from "./TS-08-THERAPEUTIC_SUSPENSIONS";
import TS10FUTURE_MEDICATIONS from "./TS-10-future-drugs.ts";

// If you want JSON files, don't forget
// "resolveJsonModule": true in your tsconfig file
//import TS01 from "./TS-01-identifiers.json"
//import TS02 from "./TS-02-posologies.json";

// Payload
export default function (): MSConfiguration {
    
    let updatedTransactions = [
        TS08THERAPEUTIC_SUSPENSIONS().transactions,
        TS10FUTURE_MEDICATIONS().transactions
    ].reduce( (acc, currentTransactions) => {

        // Starting index
        // At first iteration, it will be : 2
        // At second iteration, it will be : 2 + length of previous array
        let startingIdx = 2 + acc.length

        // Update current transactions
        let newTransactions = currentTransactions.map( (transaction, idx) => {

            // Update ID according to that new position in array
            transaction.id = startingIdx + idx;

            // Update suspension reference, if present
            if (transaction.suspensionReference) {
                // Why minus 2 ? because index starts at 2 in all configuration
                transaction.suspensionReference = startingIdx + transaction.suspensionReference - 2;
            }

            // Return modified object
            return transaction;
        });

        return [...acc, ...newTransactions]
    }, [] as TransactionConfig[])

    return {
        transactions: updatedTransactions
    }
}
