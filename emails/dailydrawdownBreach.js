const nodemailer = require("nodemailer");
require("dotenv").config();

const path = require("path");
const { headerHtml, headerImagePath } = require("./header");
const footer = require("./footer");

async function dailydrawdownBreach(receiver, name, account, serverNumber) {
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
                <h1>Dear ${name},</h1>
                <p>Unfortunately, your account has been terminated due to a rule breach. Please log into your dashboard for more details.</p>
                <p><b>Server Number:</b> ${serverNumber}</p>
                <p><b>Plan details: </b>$ ${account}</p>
                <p><b>Rule Breached:</b> Daily Drawdown</p>
                <p>No need to worry, you are able to reset your funded account for the next 30 days. Just use code: "GRYReset" at checkout for 20% off your reset. We'll send your new account details right away so you can get back to it.</p>
                <p>We wish you the best of luck</p>
                <p>Best,</p>
                <p>GRYFunding</p>
                
            </div>
            ${footer}
        </div>
    </body>
    </html>
    `;

    const subject = "Important: Daily Drawdown Breach";
    const mailOptions = {
      from: `"Margin FUNDING LLC" <${process.env.EMAIL_ADMIN}>`,
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

module.exports = dailydrawdownBreach;
