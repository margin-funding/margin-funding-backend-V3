const nodemailer = require("nodemailer");
require("dotenv").config();

const path = require("path");
const { headerHtml, headerImagePath } = require("./header");
const footer = require("./footer");

// Example asynchronous function
async function AlertEmail(req, res) {
  try {
    console.log("hello");
    // Extracting parameters
    const {
      Email,
      serverNumber,
      accountName,
      initialDeposit,
      accountBalance,
      accountEquity,
      timeGMT,
      openPositions,
      Type,
    } = req.query;
    // Validating that required parameters are not empty
    if (
      !Email ||
      !serverNumber ||
      !accountName ||
      !initialDeposit ||
      !accountBalance ||
      !accountEquity ||
      !timeGMT ||
      !openPositions ||
      !Type
    ) {
      console.log("Error Getting Values");
      return res.status(400).json({ error: "Missing required parameters" });
    }

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

    // Create additional information based on Type
    let additionalInfo = "";
    if (Type === "1") {
      additionalInfo = `Respected Sir, this Account Company ${accountName} with Account Number ${serverNumber} has reached +8% PhaseOne Profit Target`;
    } else if (Type === "2") {
      additionalInfo = `Respected Sir, this Account Company ${accountName} with Account Number ${serverNumber} has reached +8% PhaseTwo Profit Target`;
    } else if (Type === "3") {
      additionalInfo = `Respected Sir, this Account Company ${accountName} with Account Number ${serverNumber} has reached -8% Max Drawdown`;
    } else if (Type === "4") {
      additionalInfo = `Respected Sir, this Account Company ${accountName} with Account Number ${serverNumber} has reached -4% Daily Drawdown`;
    }

    // Create HTML template
    const htmlTemplate = `
    <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          h2 {
            color: #333;
          }
          p {
            color: #555;
          }
        </style>
      </head>
      <body>
       ${headerHtml}
        <h2>Account Information</h2>
        <p>${additionalInfo}</p>
        <table>
          <tr>
            <th>Server Number</th>
            <td>${serverNumber}</td>
          </tr>
          <tr>
            <th>Account Name</th>
            <td>${accountName}</td>
          </tr>
          <tr>
            <th>Initial Deposit</th>
            <td>${initialDeposit}</td>
          </tr>
          <tr>
            <th>Account Balance</th>
            <td>${accountBalance}</td>
          </tr>
          <tr>
            <th>Account Equity</th>
            <td>${accountEquity}</td>
          </tr>
          <tr>
            <th>Time (GMT)</th>
            <td>${timeGMT}</td>
          </tr>
          <tr>
            <th>Open Positions</th>
            <td>${openPositions}</td>
          </tr>
        </table>
        ${footer}
      </body>
    </html>
    `;

    const subject = `Margin FUNDING LLC ${serverNumber} Breach`;

    // Send mail
    const info = await new Promise((resolve, reject) => {
      transporter.sendMail(
        {
          from: `"Margin FUNDING LLC" <${process.env.EMAIL_ADMIN}>`, // sender address
          to: Email, // list of receivers
          subject: subject, // Subject line
          html: htmlTemplate, // html body
        },
        (err, info) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            console.log("Message sent: %s", info.messageId);
            resolve(info);
          }
        }
      );
    });

    console.log("Message sent: %s", info.messageId);
    res.json(info);
  } catch (error) {
    res.send("Error Sending Email");
    throw error;
  }
}

module.exports = { AlertEmail };
