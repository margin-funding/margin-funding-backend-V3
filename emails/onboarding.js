const nodemailer = require("nodemailer");
require("dotenv").config();
const { headerHtml, headerImagePath } = require("./header");
const footer = require("./footer");

async function sendEmail(receiver, password, name) {
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
            .credentials {
                background-color: #f5f5f5;
                padding: 15px;
                border-radius: 5px;
                margin: 15px 0;
                border-left: 4px solid #000;
            }
        </style>
    </head>
    <body>
        <div class="container">
            ${headerHtml}
            <div class="main">
                <h1>Welcome to MARGIN FUNDING</h1>
                <h2>Hello, ${name}! 🎉</h2>
                
                <p>Your login credentials for MARGIN FUNDING are as follows:</p>
                
                <div class="credentials">
                    <p><strong>Username:</strong> ${receiver}</p>
                    <p><strong>Password:</strong> ${password}</p>
                </div>
                
                <p>You will receive your trading account credentials in 1-3 business days. 📈</p>
                <p>Thank you for choosing MARGIN FUNDING for your trading journey!</p>
                
                <p>Best Regards,</p>
                <p>MARGIN FUNDING Team</p>
            </div>
            ${footer}
        </div>
    </body>
    </html>
    `;

    const subject = "Your MARGIN FUNDING Credentials";
    const mailOptions = {
      from: `"MARGIN FUNDING LLC" <${process.env.EMAIL_ADMIN}>`,
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

module.exports = sendEmail;