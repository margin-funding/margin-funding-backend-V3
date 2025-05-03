const nodemailer = require("nodemailer");
require("dotenv").config();
const path = require("path");
const { headerHtml, headerImagePath } = require("./header");
const footer = require("./footer");

async function paymentEmail(receiver, name, amount, accountBalance,server,password,serverName) {
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
            ont-family: 'Arial', sans-serif;
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
                color:rgb(0, 0, 0);
                line-height: 1;
        }
        .main h1 {
           font-size: 30px;
                color:rgb(0, 0, 0);
                font-weight: bold;
                margin-bottom: -10px;
                text-align: center;
        }
        </style>
    </head>
    <body>
        <div class="container">
        ${headerHtml}
            <div class="main">
                <h1>Hi ${name},</h1>
                <p>Welcome to the Trading Team! Below you can find the details for your new funded account, if you have any questions, contact: <a href="mailto:support@gryfunding.com">support@gryfunding.com</a></p>
                
                <h2>Account Details:</h2>
                <p>2-Step Evaluation - $${accountBalance} - MT4</p>
                
                <h2>MetaTrader Login Details</h2>
                <p><b>Account Number:</b> ${server}</p>
                <p><b>Password:</b> ${password}</p>
                <p><b>Server:</b> ${serverName}</p>
                <p>MT4 Download: <a href="https://www.metatrader4.com/en/download" target="_blank">https://www.metatrader4.com/en/download</a></p>
                
                <h2>Next Steps</h2>
                <p>You are able to begin trading now, as soon as you hit your profit target, we will send you login details for phase 2. Please refer to the rules found in your trader dashboard. We will message you if you breach any of these rules.</p>
                <p>We wish you the best of luck trading!</p>
                
                <p>Best,</p>
                <p>MarginFunding</p>
            </div>
            ${footer}
        </div>
    </body>
    </html>
    `;

    const subject = "Margin FUNDING PAYMENTS";
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

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log("Error: ", error);
  }
}

module.exports = paymentEmail;
