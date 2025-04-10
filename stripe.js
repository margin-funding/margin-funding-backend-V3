require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const moment = require("moment");

async function getBuyerEmailsByProduct() {
  try {
    let data = [];
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 25, // Limit the result to the latest 10 payment intents
    });
    //console.log(paymentIntents);
    for (const paymentIntent of paymentIntents.data) {
      let paymentMethodID = paymentIntent.payment_method;
      //console.log("paymentMethodID : ",paymentMethodID)
      let productID = paymentIntent.id;

      let amount = paymentIntent.amount;
      let status = paymentIntent.status;
      let time = moment.unix(paymentIntent.created);

      if (status == "succeeded" && paymentMethodID != null) {
        await stripe.paymentMethods
          .retrieve(paymentMethodID)
          .then((paymentDetails) => {
            let today = moment("2024-03-10"); // Hardcoded today's date
            if (moment(time).isAfter(today)) {
              data.push({
                paymentID: paymentDetails.id,
                productID: productID,
                amount: amount / 100,
                email: paymentDetails.billing_details.email,
                name: paymentDetails.billing_details.name,
                timeStamp: time,
              });
              // console.log(data);
            }
          })
          .catch((error) => {
            console.error("Error retrieving payment method:", error);
          });
      }
    }

    return data;
  } catch (error) {
    console.error("Error retrieving buyer emails:", error.message);
    throw new Error("Internal Server Error");
  }
}

module.exports = { getBuyerEmailsByProduct };
