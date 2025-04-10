const User = require("./models/user");
const bcrypt = require("bcrypt"); // Import bcrypt module
const sendEmail = require("./emails/email");
const connectDB = require("./db");
require("dotenv").config();
const Account = require("./models/account");
const Accounthistory = require("./models/accounthistory");
const { ObjectId } = require('mongodb');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');


console.log(process.env.EMAIL_ADMIN);
console.log(process.env.PASSWORD_ADMIN);

// Connect to MongoDB
connectDB();

async function Live() {
    try {

        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        const pipeline = { $expr: { $gt: [{ $size: { $ifNull: ["$accountHistory", []] } }, 0] } };

        const account = await Account.find(pipeline);
        const accountsWithPhase = [];
        for (const acc of account) {
            console.log("User: ", acc.User, "Size: ", acc.accountHistory.length," Id: ", acc._id.toString());
            const id = new ObjectId(acc._id.toString());
            const hist = await Accounthistory.findOne({account:id});
            // console.log(hist);
            if (hist) {
                acc.Phase = hist.Phase ? hist.Phase : "N/A";
            } else {
                acc.Phase = "N/A";
            }

            accountsWithPhase.push({
                Id: acc._id.toString(),
                Email: acc.User,
                Name: acc.AccountName,
                AccountSize: acc.InitialDeposit,         
                Phase: acc.Phase
            });
 
            // await sleep(100);
            
        }
        const csvWriter = createCsvWriter({
            path: 'GRY_accounts.csv',
            header: [
                { id: 'Id', title: 'Id' },
                { id: 'Email', title: 'Email' },
                { id: 'Name', title: 'Name' },
                { id: 'AccountSize', title: 'AccountSize' },  
                { id: 'Phase', title: 'Phase' },
            ]
        });

        await csvWriter.writeRecords(accountsWithPhase);

        console.log('CSV file created successfully');
        console.log(accountsWithPhase);

    } catch (error) {
        console.error(error);
    }
}
Live();