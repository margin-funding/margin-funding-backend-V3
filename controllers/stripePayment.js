const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const StripePayment = require('../models/stripePayment');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const sendEmail = require('../emails/onboarding'); // Adjust path as needed
const sendPaymentConfirmation = require("../emails/stripePaymentEmail")

class StripePaymentController {
  // Handle the webhook event directly
  static async handleWebhookEvent(event) {
    try {
      console.log('Processing webhook event:', event.type);
      
      // Check if it's a checkout.session.completed event
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        const existingPayment = await StripePayment.findOne({ 
            $or: [
              { stripeEventId: event.id },
              { checkoutSessionId: session.id }
            ]
          });
          
          if (existingPayment) {
            console.log('Payment already processed, skipping:', existingPayment._id);
            return { success: true, message: 'Payment already processed' };
          }
        
        // Extract payment details from the session
        const paymentDetails = {
          paymentId: `payment_${session.id}`,
          email: session.customer_details?.email,
          checkoutSessionId: session.id,
          paymentIntentId: session.payment_intent,
          amount: session.amount_total / 100, // Convert cents to dollars
          currency: session.currency,
          plan: session.metadata?.plan || 'default',
          accountBalance: parseInt(session.metadata?.accountBalance || 0),
          status: session.payment_status === 'paid' ? 'completed' : 'pending',
          paymentMethod: session.payment_method_types?.[0],
          country: session.customer_details?.address?.country,
          livemode: session.livemode,
          stripeEventId: event.id,
          paidAt: new Date(session.created * 1000)
        };
        
        // Save to database
        const payment = await StripePayment.create(paymentDetails);
        console.log('Payment saved to database:', payment._id);
        await sendPaymentConfirmation(
            payment.email,
            session.customer_details?.name || payment.email.split('@')[0],
            payment.amount,
            payment.currency,
            payment.paymentMethod,
            payment.checkoutSessionId
          );
        
        // Process user creation and send email if email is provided
        if (payment.email) {
          // Create user and get back the user and password
          await this.createUserIfNotExists(payment.email);
        }
        
        return { success: true, message: 'Payment processed successfully' };
      }
      
      // If it's not a checkout.session.completed event, just acknowledge
      return { success: true, message: `Event ${event.type} received but not processed` };
      
    } catch (error) {
      console.error('Error processing webhook event:', error);
      throw error;
    }
  }
  
  // Helper method to create user if not exists
  static async createUserIfNotExists(email) {
    try {
      if (!email) {
        console.log('No email provided, skipping user creation');
        return { user: null, password: null };
      }
      
      // Normalize email - convert to lowercase
      const normalizedEmail = email.toLowerCase().trim();
      
      // Check if user already exists with this email
      const existingUser = await User.findOne({ Username: normalizedEmail });
      
      if (existingUser) {
        console.log('User already exists with email:', normalizedEmail);
        return { user: existingUser, password: null };
      }
      
      // Generate a random password (8 characters with letters and digits)
      const password = this.generateRandomPassword(8);
      
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Create new user with hashed password
      const newUser = await User.create({
        Username: normalizedEmail,
        Password: hashedPassword,
      });
      
      console.log('Created new user with email:', normalizedEmail);
      const customerName = normalizedEmail.split('@')[0];
      await sendEmail(normalizedEmail, password, customerName);
      
      return { user: newUser, password: password };
    } catch (error) {
      console.error('Error creating user:', error);
      // Log error but don't throw to prevent webhook failure
      return { user: null, password: null };
    }
  }
  
  // Generate a random password with letters and digits
  static generateRandomPassword(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    
    // Ensure we have at least one uppercase letter, lowercase letter, and digit
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    password += '0123456789'[Math.floor(Math.random() * 10)];
    
    // Fill the rest with random characters
    for (let i = 3; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
    
    // Shuffle the password characters
    return password.split('').sort(() => 0.5 - Math.random()).join('');
  }
}

module.exports = StripePaymentController;