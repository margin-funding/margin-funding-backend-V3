const nodemailer = require("nodemailer");
require("dotenv").config();

const path = require("path");
const absolutePathToBanner = path.resolve(__dirname, '..', 'banner.jpeg');

async function dailydrawdownBreach(receiver, name, account, serverNumber) {
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
            <div class="footer">
            
            </div>
        </div>
    </body>
    </html>
    `;

    const subject = "Important: Daily Drawdown Breach";
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
    console.log("Error: ", error);
  }
}

module.exports = dailydrawdownBreach;
