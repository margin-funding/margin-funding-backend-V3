const { Schema, model } = require("mongoose");

const stripePaymentSchema = new Schema({
  // Unique identifier for each payment
  paymentId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Customer Email (with unique constraint per payment)
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  
  // Stripe-specific identifiers
  checkoutSessionId: {
    type: String,
    required: true,
    unique: true
  },
  
  paymentIntentId: {
    type: String,
    required: true
  },
  
  // Payment details
  amount: {
    type: Number,
    required: true
  },
  
  currency: {
    type: String,
    default: 'usd',
    uppercase: true
  },
  
  // Plan details
  plan: {
    type: String,
    required: true
  },
  
  accountBalance: {
    type: Number,
    required: true
  },
  
  // Payment status
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  
  // Additional metadata
  paymentMethod: {
    type: String,
    enum: ['card', 'link', 'bitcoin']
  },
  
  country: {
    type: String
  },
  
  // Test or live mode
  livemode: {
    type: Boolean,
    default: false
  },
  
  // Stripe event details
  stripeEventId: {
    type: String
  },
  
  // Timestamps
  paidAt: {
    type: Date
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  // Reference to user (optional)
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  // Add indexes for performance
  indexes: [
    { email: 1 },
    { plan: 1 },
    { status: 1 }
  ]
});

// Add a pre-save hook to generate a unique payment ID
stripePaymentSchema.pre('save', function(next) {
  if (!this.paymentId) {
    // Generate a unique payment ID if not already set
    this.paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

// Create a method to easily create a payment from Stripe webhook
stripePaymentSchema.statics.createFromWebhook = function(webhookData) {
  const session = webhookData.data.object;
  
  return this.create({
    paymentId: `payment_${session.id}`,
    email: session.customer_details?.email,
    checkoutSessionId: session.id,
    paymentIntentId: session.payment_intent,
    amount: session.amount_total / 100, // Convert cents to dollars
    currency: session.currency,
    plan: session.metadata?.plan || 'unknown',
    accountBalance: session.metadata?.accountBalance || 0,
    status: session.payment_status === 'paid' ? 'completed' : 'pending',
    paymentMethod: session.payment_method_types?.[0],
    country: session.customer_details?.address?.country,
    livemode: session.livemode,
    stripeEventId: webhookData.id,
    paidAt: new Date(session.created * 1000)
  });
};

// Create the model
module.exports = model("StripePayment", stripePaymentSchema);