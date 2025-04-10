const { Schema, model } = require("mongoose");

// Define the schema
const MyDataSchema = new Schema({
  User: { type: String, required: true },
  InitialDeposit: { type: String, required: true },
  Server: { type: String, required: true },
  OpenPositions: { type: String },
  AccountName: { type: String, required: true },
  ServerName: { type: String, required: true },
  Password: { type: String, required: true },
  startingEquity: { type: String, required: true },
  accountHistory: [
    {
      type: Schema.ObjectId,
      ref: "Accounthistory",
    },
  ],
});

module.exports = model("Account", MyDataSchema);
