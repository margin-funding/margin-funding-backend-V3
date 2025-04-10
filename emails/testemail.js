const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendTestEmail(receiver, password, name) {
  try {
    if (!receiver) return;

    const transporter = nodemailer.createTransport({
      port: 465,
      host: "smtp.gmail.com",
      secure: true,
      secureConnection: false,
      auth: {
        user: process.env.EMAIL_ADMIN, // Your email address
        pass: process.env.PASSWORD_ADMIN, // Your email password
      },
      tls: {
        rejectUnauthorized: true,
      },
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
            background: url('cid:banner-image-cid') no-repeat center center;
            background-size: cover;
            padding: 30px;
            text-align: center;
            color: #fff;
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
      from: `"GRY FUNDING LLC" <${process.env.EMAIL_ADMIN}>`, // sender address
      to: receiver, // list of receivers
      subject: subject, // Subject line
      html: htmlTemplate, // html body
      attachments: [
        {
          filename: "GRY FUNDING.jpeg", // Name of your banner image file
          path: "/path/to/banner.jpeg", // Actual path to the banner image file
          cid: "banner-image-cid", // CID for embedding the image in the email
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error: ", error);
  }
}

module.exports = sendTestEmail;
