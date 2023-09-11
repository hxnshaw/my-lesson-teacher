const express = require("express");
const router = express.Router();
const initializePayment = require("../controllers/subscription");

router.get("/transaction/verify/:reference", initializePayment.verifyPayment);

module.exports = router;
