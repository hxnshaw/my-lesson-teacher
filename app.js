require("dotenv").config();

//Express
const express = require("express");
const app = express();

//Packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
//Security packages
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");

//Database
const connectDB = require("./db/connect");

//Routers
const adminRouter = require("./routes/adminRouter");
const teacherRouter = require("./routes/teacherRouter");

//NotFound and ErrorHandler Middlewares
const notFoundMiddleware = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/error-handler");

//setup security
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 20 * 60 * 1000, //10 minutes
    max: 100, //100 requests per 10 minutes,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET_TOKEN));
app.use(fileUpload({ useTempFiles: true }));

//Setup Routers
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/teacher", teacherRouter);

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
