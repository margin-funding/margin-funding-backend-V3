const nodemailer = require("nodemailer");
require("dotenv").config();

const path = require("path");

const absolutePathToBanner = path.resolve(__dirname, '..', 'banner.jpeg');

async function phaseTwoPass(receiver, name) {
  try {
    if (!receiver) return;

    const transporter = nodemailer.createTransport({
      port: 465,
      host: "smtp.gmail.com",
      secure: true,
      secureConnection: false,
      auth: {
        user: process.env.EMAIL_ADMIN,
        pass: process.env.PASSWORD_ADMIN,
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
                background-color: #ffffff;
            }
            .header {
                background: url('cid:banner-image-cid') no-repeat center top;
                background-size: cover;
                height: 180px;
                color: #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .main {
                padding: 20px;
                text-align: left; /* Align text to the left */
            }
            .footer {
                background-color: #eeeeee;
                padding: 10px 20px;
                text-align: center;
                font-size: 12px;
            }
            .footer a {
                color: #333333;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <!-- Header with the background image -->
            </div>
            <div class="main">
                <h1>Congratulations ${name},</h1>
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
                <p>Could you please consider leaving us a review on TrustPilot? This is simply a friendly request and won't impact your live account activation. It won't take much time, and your support means a lot to us. You can find the link here: <a href="https://trustpilot.com/review/GRYFunding" target="_blank">Trustpilot Review</a>.</p>
                <p>Once again, outstanding work on passing your evaluation, we look forward to having you on the team!</p>
                <p>Please be aware that while your live account remains active, we have a funding limit of up to $100,000 per trader at any given time. In the event of a breach of your live account, you must seek approval for further funding before initiating a new evaluation. Proceeding with a new evaluation without authorization may jeopardize your eligibility for a live account upon successful completion, and refunds will not be provided. Additionally, please ensure you understand and adhere to our policy against copy trading across multiple accounts. For detailed information on our account rules, please refer to our website and FAQs. If you breach terms on a new live account, please contact us before initiating a new evaluation.</p>
                <p>Best,</p>
                <p>GRYFunding</p>
            </div>
            <div class="footer">
                <a href="https://gryfunding.com/">gryfunding.com</a>
                <!-- Add social media icons here if necessary -->
            </div>
        </div>
    </body>
    </html>
    `;

    const subject = "Welcome to GRY Funding - Phase Two Passed";
    const mailOptions = {
      from: `"GRY FUNDING LLC" <${process.env.EMAIL_ADMIN}>`, // sender address
      to: receiver, // list of receivers
      subject: subject, // Subject line
      html: htmlTemplate, // html body
      attachments: [
        {
          filename: "GRY FUNDING.jpeg",
          path: absolutePathToBanner, // Update this path
          cid: "banner-image-cid", // Make sure this CID matches the one used in the HTML template
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
