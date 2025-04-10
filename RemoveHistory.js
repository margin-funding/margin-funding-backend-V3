const User = require("./models/user");
const bcrypt = require("bcrypt"); // Import bcrypt module
const sendEmail = require("./emails/email");
const connectDB = require("./db");
require("dotenv").config();
const Account = require("./models/account");


console.log(process.env.EMAIL_ADMIN);
console.log(process.env.PASSWORD_ADMIN);

// Connect to MongoDB
connectDB();

async function periodicEmailFetch() {
    try {

        

        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const pipeline =  {$expr:{$gt:[{$size:{$ifNull:["$accountHistory",[]]}},100]}};

        const account = await Account.find(pipeline);
        for (const acc of account){
        console.log("User: ",acc.User,"Size: ", acc.accountHistory.length);
        

        console.log("Done");
        await sleep(3000);
        if (acc && acc.accountHistory && acc.accountHistory.length > 100) {
            // Remove the first 10 items
            const updatedHistory = acc.accountHistory.slice(acc.accountHistory.length - 100);
      
            // Update the document with the new array
            const update = { $set: { accountHistory: updatedHistory } };
      
            const result = await Account.updateOne({ _id: acc._id }, update);
      
            if (result.matchedCount > 0) {
              console.log('Successfully updated the document.');
            } else {
              console.log('No document matches the provided query.');
            }
          } else {
            console.log('Document not found or accountHistory is empty.');
          }
        }

    } catch (error) {
        console.error(error);
    }
}
periodicEmailFetch();