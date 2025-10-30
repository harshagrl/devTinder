require("dotenv").config();
const express = require("express");
const app = express();
const User = require("./models/user");
const connectDB = require("./config/database.js");
app.use(express.json());
app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error saving user data: " + err.message);
  }
});
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
