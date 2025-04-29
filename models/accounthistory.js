  const { Schema, model } = require("mongoose");

  // Define the schema
  const accounthistorySchema = new Schema({
    Balance: { type: String, required: true },
    Equity: { type: String, required: true },
    LastHeartBeat: { type: String, required: true },
    OpenPositions: { type: String },
    Phase: { type: String, required: true },
    Status: { type: String, required: true },
    TotalTrades: { type: String, required: true },
    ProfitTarget: { type: String, required: true },
    MaxDailyDrawdown: { type: String, required: true },
    MaxTotalDrawdown: { type: String, required: true },

    account: {
      type: Schema.ObjectId,
      ref: "Account",
    },
    createdAt: { type: Date, default: Date.now() },
  });

  // Create the model
  module.exports = model("Accounthistory", accounthistorySchema);
