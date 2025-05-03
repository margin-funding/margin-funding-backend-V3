const nodemailer = require("nodemailer");
require("dotenv").config();
const { headerHtml, headerImagePath } = require("./header");
const footer = require("./footer");

async function sendPaymentConfirmation(receiver, name, amount, currency, paymentMethod, checkoutId) {
  try {
    if (!receiver) return;

    const transporter = nodemailer.createTransport({
      port: 465,
      host: "smtp.gmail.com",
      secure: true,
      secureConnection: false,
      auth: {
        user: "marginfundingnet@gmail.com",
        pass: "olvpdexagtpfzwps",
      },
      tls: {
        rejectUnauthorized: true,
      },
    });

    // Verify connection configuration
    await new Promise((resolve, reject) => {
      transporter.verify(function (error, success) {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          console.log("Server is ready to take our messages");
          resolve(success);
        }
      });
    });

    // Format currency properly
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase() || 'USD'
    }).format(amount);

    // Capitalize payment method for display
    const displayPaymentMethod = paymentMethod ? 
      paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1) : 
      'Credit Card';

    const htmlTemplate = `
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 0;
                color: #333333;
                background-color: #ffffff;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 20px auto;
                background-color: rgba(245, 245, 220, 0.1);
                border-radius: 10px;
                border: 3px solid #000000;
                box-shadow: 0 0 100px 0 rgba(0, 0, 0, 1);
            }
            .main {
                padding: 20px;
                text-align: left;
                color: rgb(0, 0, 0);
                line-height: 1.5;
            }
            h1 {
                font-size: 30px;
                color: rgb(0, 0, 0);
                font-weight: bold;
                margin-bottom: -10px;
                text-align: center;
            }
            h2 {
                font-size: 20px;
                color: rgb(0, 0, 0);
                margin-top: -10px;
                text-align: center;
            }
            .footer {
                padding: 15px;
                text-align: center;
                font-size: 12px;
                color: #666;
                border-top: 1px solid #ddd;
            }
            .payment-details {
                background-color: #f5f5f5;
                padding: 20px;
                border-radius: 5px;
                margin: 20px 0;
                border-left: 4px solid #4CAF50;
            }
            .payment-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                border-bottom: 1px dotted #ddd;
                padding-bottom: 10px;
            }
            .payment-row:last-child {
                border-bottom: none;
                margin-bottom: 0;
                padding-bottom: 0;
            }
            .payment-label {
                font-weight: bold;
                color: #555;
            }
            .payment-value {
                text-align: right;
            }
            .payment-total {
                margin-top: 15px;
                padding-top: 15px;
                border-top: 2px solid #ddd;
                font-size: 18px;
                font-weight: bold;
            }
            .success-message {
                background-color: #e8f5e9;
                border-left: 4px solid #4CAF50;
                padding: 10px 15px;
                margin: 15px 0;
                border-radius: 4px;
            }
            .thank-you {
                text-align: center;
                margin: 30px 0 20px;
                font-size: 18px;
                color: #4CAF50;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="container">
            ${headerHtml}
            <div class="main">
                <h1>Payment Confirmation</h1>
                <h2>Thank you, ${name}! 🎉</h2>
                
                <div class="success-message">
                    <p>Your payment has been successfully processed. Thank you for your purchase!</p>
                </div>
                
                <p>Here are your payment details:</p>
                
                <div class="payment-details">
                    <div class="payment-row">
                        <span class="payment-label">Transaction Date:</span>
                        <span class="payment-value">${new Date().toLocaleDateString()}</span>
                    </div>
                    <div class="payment-row">
                        <span class="payment-label">Payment Method:</span>
                        <span class="payment-value">${displayPaymentMethod}</span>
                    </div>
                    <div class="payment-row">
                        <span class="payment-label">Order Reference:</span>
                        <span class="payment-value">${checkoutId.substring(0, 16)}...</span>
                    </div>
                    <div class="payment-row payment-total">
                        <span class="payment-label">Total Paid:</span>
                        <span class="payment-value">${formattedAmount}</span>
                    </div>
                </div>
                
                <p>Your MARGIN FUNDING account is now being set up and you will receive your login credentials separately.</p>
                
                <p>If you have any questions about your payment or service, please don't hesitate to contact our support team.</p>
                
                <div class="thank-you">
                    Thank you for choosing MARGIN FUNDING!
                </div>
                
                <p>Best Regards,</p>
                <p>MARGIN FUNDING Team</p>
            </div>
            ${footer}
        </div>
    </body>
    </html>
    `;

    const subject = "Payment Confirmation - MARGIN FUNDING";
    const mailOptions = {
      from: "MARGIN FUNDING LLC",
      to: receiver,
      subject: subject,
      html: htmlTemplate,
      attachments: [
        {
          filename: "Header.png",
          path: headerImagePath,
          cid: "header-image-cid",
        },
      ],
    };

    // Send mail
    const info = await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log(info);
          resolve(info);
        }
      });
    });

    console.log("Payment confirmation email sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending payment confirmation: ", error);
  }
}

module.exports = sendPaymentConfirmation;
