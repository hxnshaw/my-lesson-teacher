require("dotenv").config();

//Express
const express = require("express");
const app = express();

//Database
const connectDB = require("./db/connect");

const port = process.env.PORT || 2023;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is live on ${port}`));
  } catch (error) {
    console.log(error);
  }
};

console.log("1");

start();
