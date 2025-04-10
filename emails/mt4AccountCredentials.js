const nodemailer = require("nodemailer");
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const absolutePathToBanner = path.resolve(__dirname, "..", "banner.jpeg");
const absolutePathToPDF = path.resolve(
  __dirname,
  "Illegal_Trading_Practices.pdf"
);

async function mt4AccountCredentials(
  receiver,
  name,
  server,
  serverName,
  password,
  initialDeposit,
  Phase
) {
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
        .main h1 {
            font-size: 20px;
            margin-top: 0;
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
        .footer img {
            vertical-align: middle;
        }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <!-- Header is empty, background will be set by the email -->
            </div>
            <div class="main">
                <h1>Hi ${name},</h1>
                <p>Welcome to the Trading Team! Below you can find the details for your new funded account, if you have any questions, contact: <a href="mailto:support@gryfunding.com">support@gryfunding.com</a></p>
                
                <h2>Account Details:</h2>
                <p>2-Step Evaluation - $${initialDeposit} - MT4</p>
                
                <h2>MetaTrader Login Details</h2>
                <p><b>Account Number:</b> ${server}</p>
                <p><b>Password:</b> ${password}</p>
                <p><b>Server:</b> ${serverName}</p>
                <p>MT4 Download: <a href="https://www.metatrader4.com/en/download" target="_blank">https://www.metatrader4.com/en/download</a></p>
                
                <h2>Next Steps</h2>
                <p>You are able to begin trading now, as soon as you hit your profit target, we will send you login details for phase 2. Please refer to the rules found in your trader dashboard. We will message you if you breach any of these rules.</p>
                <p>We wish you the best of luck trading!</p>
                
                <p>Best,</p>
                <p>GRYFunding</p>
            </div>
            <div class="footer">
                <!-- Footer content with social icons... -->
            </div>
        </div>
    </body>
    </html>
    `;
    const pdfAttachment = fs.readFileSync(absolutePathToPDF);
    const subject = `Phase ${Phase} Account Credentials`;
    const mailOptions = {
      from: `"GRY FUNDING LLC" <${process.env.EMAIL_ADMIN}>`,
      to: receiver,
      subject: subject,
      html: htmlTemplate,
      attachments: [
        {
          filename: "GRY FUNDING.jpeg",
          path: absolutePathToBanner,
          cid: "banner-image-cid",
        },
        {
          filename: "Illegal_Trading_Practices.pdf", // Update with your PDF file name
          content: pdfAttachment,
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
    console.log("Error: ", error);
  }
}

module.exports = mt4AccountCredentials;
