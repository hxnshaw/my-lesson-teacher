require("dotenv").config();
const https = require("https");
const Student = require("../models/Student");

const payStack = {
  acceptPayment: async (req, res) => {
    try {
      const first_name = req.body.first_name;
      const last_name = req.body.last_name;
      const email = req.body.email;
      const phone_number = req.body.phone_number;
      const params = JSON.stringify({
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone_number: phone_number,
        amount: 25000 * 100,
        plan: process.env.PAYSTACK_SUBSCRIPTION_PLAN,
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
            let userReferenceCode = result.data.reference;
            const student = await Student.findOne({ email });
            student.referenceCode = [];
            student.referenceCode.push(userReferenceCode);
            await student.save();
            console.log(student);
            console.log(userReferenceCode);
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
};

const initializePayment = payStack;
module.exports = initializePayment;
