const mongoose = require("mongoose");

// Define the schema
const PaymentSchema = new mongoose.Schema({
  paymentID: { type: String, required: true },
  productID: { type: String, required: true },
  amount: { type: Number, required: true }, // Changed from Integer to Number
  email: { type: String, required: true },
  name: { type: String, required: true },
  timeStamp: { type: String, required: true },
});

// Create the model
const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = Payment;