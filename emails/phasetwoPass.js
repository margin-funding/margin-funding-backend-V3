const nodemailer = require("nodemailer");
require("dotenv").config();

const path = require("path");

const { headerHtml, headerImagePath } = require("./header");
const footer = require("./footer");

async function phaseTwoPass(receiver, name) {
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

    const htmlTemplate = `
    <html>
    <head>
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
                text-align: left; /* Align text to the left */
               color:rgb(0, 0, 0);
               line-height: 1;
            }
                   h1 {
                font-size: 30px;
                color:rgb(0, 0, 0);
                font-weight: bold;
                margin-bottom: -10px;
                text-align: center;
            }
            h2{
                font-size: 20px;
                color:rgb(0, 0, 0);
                margin-top: -10px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
        ${headerHtml}
            <div class="main">
                <h1> Congratulations </h1>
                <h2>${name}! 🎉</h2>
                <p>We want to personally congratulate you on your outstanding trading performance! You have successfully passed phase 2 of our evaluation, with that being said...</p>
                <p>Welcome to the team!</p>
                <p>We will send you details of your funded account once you have completed the next steps below. This normally takes between 1-3 working days.</p>
                <p>Your next steps:</p>
                <ul>
                    <li>Login to your Trader dashboard and sign the traders agreement</li>
                    <li>KYC - Verification</li>
                    <li>Please respond to this email once you have completed it, or if you have already completed it previously, or if you have any issues with completing this process.</li>
                </ul>
                <p>TrustPilot</p>
                <p>Could you please consider leaving us a review on TrustPilot? This is simply a friendly request and won't impact your live account activation. It won't take much time, and your support means a lot to us. You can find the link here: <a href="https://trustpilot.com/review/MarginFunding" target="_blank">Trustpilot Review</a>.</p>
                <p>Once again, outstanding work on passing your evaluation, we look forward to having you on the team!</p>
                <p>Please be aware that while your live account remains active, we have a funding limit of up to $100,000 per trader at any given time. In the event of a breach of your live account, you must seek approval for further funding before initiating a new evaluation. Proceeding with a new evaluation without authorization may jeopardize your eligibility for a live account upon successful completion, and refunds will not be provided. Additionally, please ensure you understand and adhere to our policy against copy trading across multiple accounts. For detailed information on our account rules, please refer to our website and FAQs. If you breach terms on a new live account, please contact us before initiating a new evaluation.</p>
                <p>Best,</p>
                <p>MarginFunding</p>
            </div>
            ${footer}
        </div>
    </body>
    </html>
    `;

    const subject = "Welcome to Margin Funding - Phase Two Passed";
    const mailOptions = {
      from: `"MARGIN FUNDING LLC" <${process.env.EMAIL_ADMIN}>`, // sender address
      to: receiver, // list of receivers
      subject: subject, // Subject line
      html: htmlTemplate, // html body
      attachments: [
        {
          filename: "Header.png",
          path: headerImagePath, // Update this path
          cid: "header-image-cid", // Make sure this CID matches the one used in the HTML template
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

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error: ", error);
  }
}

module.exports = phaseTwoPass;
