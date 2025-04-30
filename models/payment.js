const mongoose = require("mongoose");

// Define the schema
const PaymentSchema = new mongoose.Schema(
  {
    // NowPayments invoice fields
    id: { type: String },
    token_id: { type: String },
    order_id: { type: String, unique: true }, 
    order_description: { type: String },
    price_amount: { type: String },
    price_currency: { type: String },
    pay_currency: { type: String },
    ipn_callback_url: { type: String },
    invoice_url: { type: String },
    success_url: { type: String },
    cancel_url: { type: String },
    partially_paid_url: { type: String },
    status: { type: String },
    payout_currency: { type: String },
    created_at: { type: String },
    updated_at: { type: String },
    is_fixed_rate: { type: Boolean },
    is_fee_paid_by_user: { type: Boolean },
    email: { type: String },
  },
  { timestamps: true }
);

// Create the model
const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = Payment;
