const nodemailer = require("nodemailer");
require("dotenv").config();
const path = require("path");
const { headerHtml, headerImagePath } = require("./header");
const footer = require("./footer");

async function phaseonePass(receiver, name) {
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
                text-align: left;
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
                <p>You have successfully passed phase one of your Evaluation.  🚀</p>
                <p>Keep an eye out, you will receive your new account details for phase two shortly. 📩</p>
                <p>Only <b style="color: rgb(21, 107, 0);">5%</b> to go, you got this! </p>
                <p>Best Regards, </p>
                <p>MarginFunding</p>
            </div>
            ${footer}
        </div>
    </body>
    </html>
    `;

    const subject = "Congratulations on Passing Phase One!";
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
    console.error("Error: ", error);
  }
}

module.exports = phaseonePass;
