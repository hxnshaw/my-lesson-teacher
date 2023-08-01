require("dotenv").config();

//Express
const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
require("./google-auth/passport");
const Student = require("./models/Student");

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
const studentRouter = require("./routes/studentRouter");
const subscriptionRouter = require("./routes/subscription");

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

//GOOGLE AUTH
// express session
app.use(
  session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Middleware used in protected routes to check if the user has been authenticated
const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

const userFound = async (req, res, next) => {
  try {
    const user = await Student.findOne({ email: req.user.emails[0].value });
    if (!user) {
      res.redirect("/failed");
      // res.json({ msg: "user not found" });
    }
    // res.status(200).json({ data: user });
    next();
  } catch (error) {
    console.error(error);
  }
};

// Base route
app.get("/home", (req, res) => {
  res.send("Home Page");
});

// Google Auth consent screen route
app.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

// Call back route
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failed",
  }),
  function (req, res) {
    res.redirect("/success");
  }
);

// failed route if the authentication fails
app.get("/failed", (req, res) => {
  console.log("User is not authenticated");
  res.send("Failed");
});

// Success route if the authentication is successful
app.get("/success", isLoggedIn, userFound, (req, res) => {
  console.log("You are logged in");
  res.send(`Welcome ${req.user.displayName}`);
});

// Route that logs out the authenticated user
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error while destroying session:", err);
    } else {
      req.logout(() => {
        console.log("You are logged out");
        res.redirect("/home");
      });
    }
  });
});

//Setup Routers
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/teacher", teacherRouter);
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/subcribe", subscriptionRouter);

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
