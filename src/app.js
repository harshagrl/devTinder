const express = require("express");
const app = express();
const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");
const authRouter = require("./routers/authRouter.js");
const profileRouter = require("./routers/profileRouter.js");
const requestRouter = require("./routers/requestRouter.js");
const userRouter = require("./routers/userRouter.js");
const cors = require("cors");
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(3000, () => {
      console.log("Server is running at port 3000");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected: " + err.message);
  });
