require("dotenv").config();

//Express
const express = require("express");
const app = express();

//Database
const connectDB = require("./db/connect");

//Routers

//NotFound and ErrorHandler Middlewares
const notFoundMiddleware = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/error");

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
const port = process.env.PORT || 2023;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is live on ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
