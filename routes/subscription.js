const express = require("express");
const router = express.Router();
const initializePayment = require("../controllers/subscription");

router.post("/acceptpayment", initializePayment.acceptPayment);

//router.get("/transaction/verify/:reference", initializePayment.verifyPayment);

module.exports = router;
