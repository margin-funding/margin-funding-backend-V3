const nodemailer = require("nodemailer");
require("dotenv").config();

const path = require("path");
const absolutePathToBanner = path.resolve(__dirname, '..', 'banner.jpeg');
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
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #333;
            color: #777;
            margin: 0;
            padding: 0;
          }
          .header {
            background: url('cid:banner-image-cid') no-repeat center top; /* Adjust position */
            -webkit-background-size: cover;
            background-size: cover;
            background-position: top center; /* Position at the top center */
            height: 210px; /* Fixed height for the banner */
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
          h1 {
            font-size: 36px;
            font-weight: bold;
            margin: 0;
          }
          main {
            padding: 30px;
            background-color: #fff;
            color: #333;
          }
          footer {
            background-color: #1a1a1a;
            color: #fff;
            padding: 20px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>GRY FUNDING</h1>
        </div>
        <main>
          <p>Dear ${name},</p>
          <p>Your login credentials for GRY FUNDING are as follows:</p>
          <ul>
            <li><strong>Username:</strong> ${receiver}</li>
            <li><strong>Password:</strong> ${password}</li>
          </ul>
          <p>You will get your trading account credentials in 1-3 business days.</p>
          <p>Thank you for choosing GRY FUNDING.</p>
          <!-- ... additional content ... -->
        </main>
        <footer>
          © ${new Date().getFullYear()} GRY FUNDING LLC. All rights reserved.
        </footer>
      </body>
    </html>
    `;

    const subject = "Your GRY FUNDING Credentials";
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
