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
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const user = await User.find({ email: userEmail });
    if (user.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }

  // try {
  //   const { id } = req.body;
  //   const user = await User.findById(id);
  //   if (!user) {
  //     res.status(404).send("User not found");
  //   }
  //   res.send(user);
  // } catch (err) {
  //   res.status(400).send("Something went wrong");
  // }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
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
