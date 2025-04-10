const User = require("./models/user");
const bcrypt = require("bcrypt"); // Import bcrypt module
const sendEmail = require("./emails/email");
const connectDB = require("./db");
require("dotenv").config();

console.log(process.env.EMAIL_ADMIN);

// Connect to MongoDB
connectDB();

async function periodicEmailFetch() {
    try {
        let buyerEmails = [
            {
                email: 'dieselalerts@gmail.com',
                name: ''
            }
        ]

        buyerEmails.map(async (paymentData) => {
            let user = await User.findOne({ Username: paymentData.email });
            const randomPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);
            if (!user) {
                user = new User({
                    Username: paymentData.email,
                    Password: hashedPassword,
                });
                await sendEmail(paymentData.email, randomPassword, paymentData.name);
                await user.save();
            }
        })

    } catch (error) {
        console.error(error);
    }
}
periodicEmailFetch();