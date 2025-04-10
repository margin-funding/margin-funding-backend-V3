const express = require("express");
const connectDB = require("./db");
const User = require("./models/user");
const Account = require("./models/account");
const Userdata = require("./models/userdata");
const bcrypt = require("bcrypt"); // Import bcrypt module
const { getBuyerEmailsByProduct } = require("./stripe");
const Payment = require("./models/payment");
const cron = require("node-cron");
const cors = require("cors");
require("dotenv").config();
const app = express();
const sendEmail = require("./emails/email");
const paymentEmail = require("./emails/paymentEmail");
const dailydrawdownBreach = require("./emails/dailydrawdownBreach");
const maxdrawdownBreach = require("./emails/maxdrawdownBreach");
const mt4AccountCredentials = require("./emails/mt4AccountCredentials");
const { AlertEmail } = require("./emails/tradeEmail");
const phaseTwoPass = require("./emails/phasetwoPass");
const phaseonePass = require("./emails/phaseonePass");
const accounthistory = require("./models/accounthistory");
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
const PORT = process.env.PORT;

// Connect to MongoDB
connectDB();

// Define a simple route
app.get("/", async (req, res) => {
  res.send("GryFunding Backend Running V2");
});
app.get("/admin/data", async (req, res) => {
  try {
    const data = await Account.find();
    res.json(data);
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/sendEmail", async (req, res) => {
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

  try {
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

    if (Type === "1") {
      await phaseonePass(Email, accountName, initialDeposit, serverNumber);
      // Send success response
      return res.status(200).json({ message: "Email sent successfully 1" });
    }

    if (Type === "2") {
      await phaseTwoPass(Email, accountName, initialDeposit, serverNumber);
      return res.status(200).json({ message: "Email sent successfully 2" });
    }

    if (Type === "3") {
      await maxdrawdownBreach(Email, accountName, initialDeposit, serverNumber);
      return res.status(200).json({ message: "Email sent successfully 3" });
    }

    if (Type === "4") {
      await dailydrawdownBreach(
        Email,
        accountName,
        initialDeposit,
        serverNumber
      );
      return res.status(200).json({ message: "Email sent successfully 4" });
    }

    // Send success response
    return res.status(200).json({ message: "No Type Found" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  console.log("body : ", req.body);
  let username = req.body.username;
  let password = req.body.password;
  console.log("username: ", username, " password : ", password);
  if (!username || !password)
    res.send({ success: false, message: "User not found" });
  else {
    let isLogin = await findUser(username, password);
    res.send(isLogin);
  }
});

app.get("/AccountData", async (req, res) => {
  try {
    console.log("ALL RECEIVED PARAMETERS:", req.query);
    const {
      User,
      Server,
      InitialDeposit,
      Balance,
      Equity,
      LastHeartBeat,
      OpenPositions,
      AccountName,
      Phase,
      ServerName,
      Password,
      TotalTrades,
      Status,
      ProfitTarget,
      MaxDailyDrawdown,
      MaxTotalDrawdown,
    } = req.query;

    if (!User || !Server) {
      return res.sendStatus(-1);
    }

    const newData = {
      User,
      InitialDeposit,
      startingEquity: Equity,
      Server,
      OpenPositions,
      AccountName,
      ServerName,
      Password,
    };

    let acc = await Account.findOne({ User, Server });

    if (!acc) {
      acc = await Account.create(newData);
      await mt4AccountCredentials(
        User,
        AccountName,
        Server,
        ServerName,
        Password,
        InitialDeposit,
        Phase
      );
      return res.send("1");
    }
    const accountHst = await accounthistory.create({
      Balance,
      Equity,
      LastHeartBeat,
      TotalTrades,
      Status,
      ProfitTarget,
      MaxDailyDrawdown,
      Phase,
      MaxTotalDrawdown,
      OpenPositions,
      account: acc?._id,
    });

    if (accountHst) {
      const details = await Account.findOne({ User, Server }).populate(
        "accountHistory"
      );
      await Account.findOneAndUpdate(
        { User, Server },
        { accountHistory: [...details.accountHistory, accountHst?._id] },
        { new: true }
      );

      
      return res.send("1");
    }
  } catch (error) {
    console.error("New Data:", req.query);
    console.error("Error updating account data:", error);
    return res.send("-1");
  }
});

app.get("/userdata", async (req, res) => {
  try {
    const username = req.query.username;
    console.log("username userdata : ", username);
    if (!username) {
      return res
        .status(400)
        .json({ success: false, message: "Username is required" });
    }

    // Find the user based on the provided username
    const user = await User.findOne({ Username: username });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found in Users" });
    }

    // Find the account data based on the user's username
    const accounts = await Account.find({ User: username }).populate(
      "accountHistory"
    );

    // Return the user and account data as JSON
    res
      .status(200)
      .json({ success: true, userdata: user, accountdata: accounts });
  } catch (error) {
    console.error("Error retrieving user and account data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/profiledata", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      emailAddress,
      phoneNumber,
      city,
      address,
      zipCode,
      countryOfResidence,
    } = req.body;
    const existingUser = await Userdata.findOne({ EmailAddress: emailAddress });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists.",
      });
    }
    const profile = new Userdata({
      FirstName: firstName,
      LastName: lastName,
      EmailAddress: emailAddress,
      PhoneNumber: phoneNumber,
      City: city,
      Address: address,
      ZipCode: zipCode,
      CountryOfResidence: countryOfResidence,
    });

    await profile.save();
    res
      .status(201)
      .json({ success: true, message: "Profile saved successfully.", profile });
  } catch (error) {
    console.error("Error saving profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Function to create a user
async function createUser(username, password) {
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ Username: username });
    if (existingUser) {
      console.log("User already exists");
      return { success: false, message: "User already exists" };
    }

    // Encrypt the password before saving it
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // If the user doesn't exist, create a new user
    const newUser = new User({ Username: username, Password: hashedPassword });
    await newUser.save();

    console.log("User created successfully");
    return { success: true, message: "User created successfully" };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, message: "Error creating user" };
  }
}

// Function to find a user (returns a Promise)
function findUser(username, password) {
  return new Promise(async (resolve) => {
    try {
      // Find the user by username
      const foundUser = await User.findOne({ Username: username });
      console.log("Database Reponse : ", foundUser, " foundUser: ", foundUser);

      if (!foundUser) {
        console.log("User not found");
        resolve({ success: false, message: "User not found" });
        return;
      }

      // Compare the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, foundUser.Password);

      if (passwordMatch) {
        console.log("User exists");
        resolve({ success: true, message: "User exists" });
      } else {
        console.log("Incorrect password");
        resolve({ success: false, message: "Incorrect password" });
      }
    } catch (error) {
      console.error("Error finding user:", error);
      resolve({ success: false, message: "Error finding user" });
    }
  });
}

// cron job
cron.schedule("0 2 * * *", async () => {
  try {
    try {
      const accounts = await Account.find().populate("accounthistory");
      if (accounts.length === 0) {
        console.error("No accounts found");
        return;
      }

      for (const account of accounts) {
        if (account.accountHistory.length === 0) {
          console.log(`No account history found for account ${account._id}`);
          continue;
        }

        // Get the last element of the accountHistory array
        const lastHistory =
          account.accountHistory[account.accountHistory.length - 1];

        // Update the startingEquity field with the Equity value from the last history
        account.startingEquity = lastHistory.Equity;

        // Save the updated account document
        await account.save();

        console.log(
          `startingEquity updated successfully for account ${account._id}`
        );
      }
    } catch (error) {
      console.error("Error updating startingEquity:", error);
    }

    console.log("Task completed successfully");
  } catch (error) {
    console.error("Error executing the task:", error);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
