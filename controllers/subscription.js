require("dotenv").config();
const https = require("https");
const axios = require("axios");
const Student = require("../models/Student");
const calculateNextPayment = require("../utils/subDueDate");

const payStack = {
  acceptPayment: async (req, res) => {
    try {
      const email = req.body.email;
      const metadata = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone_number: req.body.phone_number,
      };

      const params = JSON.stringify({
        email: email,
        amount: process.env.PAYSTACK_AMOUNT,
        plan: process.env.PAYSTACK_SUBSCRIPTION_PLAN,
        metadata: metadata,
      });

      //options
      const options = {
        hostname: "api.paystack.co",
        port: 443,
        path: "/transaction/initialize",
        method: "POST",
        headers: {
          Authorization: process.env.PAYSTACK_KEY,
          "Content-Type": "application/json",
        },
      };
      //client request to paystack API
      const clientReq = https
        .request(options, (apiRes) => {
          let data = "";
          apiRes.on("data", (chunk) => {
            data += chunk;
          });
          apiRes.on("end", async () => {
            let result = JSON.parse(data);
            console.log(result);
            return res.status(200).json(data);
          });
        })
        .on("error", (error) => {
          console.error(error);
        });
      clientReq.write(params);
      clientReq.end();
    } catch (error) {
      //Handle any errors that occur during the request
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  },

  // Verify Payment Controller
  verifyPayment: async (req, res) => {
    const ref = req.params.reference;
    try {
      const options = {
        hostname: "api.paystack.co",
        port: 443,
        path:
          "https://api.paystack.co/transaction/verify/" +
          encodeURIComponent(ref),
        method: "GET",
        headers: {
          Authorization: process.env.PAYSTACK_KEY,
          "Content-Type": "application/json",
        },
      };

      const clientReq = https.request(options, (apiRes) => {
        let data = "";

        apiRes.on("data", (chunk) => {
          data += chunk;
        });

        apiRes.on("end", async () => {
          let result = JSON.parse(data);
          let userEmail = result.data.customer.email;
          let userReferenceCode = result.data.reference;
          const student = await Student.findOne({ email: userEmail });
          student.referenceCode = [];
          res.status(200).json(result);
          if (result.data.status === "success") {
            let date = Date.now();
            let nextpaymentDate;
            //Get the date of the next payment(subscription)
            nextpaymentDate = await calculateNextPayment(date);
            //save the reference code to the user
            student.referenceCode.push(userReferenceCode);
            student.next_payment_date = nextpaymentDate;
          } else {
            return res
              .status(401)
              .json({ message: "Oops! Transaction Failed" });
          }
          await student.save();
        });
      });
      clientReq.write(ref);
      clientReq.end();
    } catch (error) {
      // Handle any errors that occur during the request
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  },
};

const initializePayment = payStack;
module.exports = initializePayment;
