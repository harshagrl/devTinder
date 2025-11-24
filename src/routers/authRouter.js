const express = require("express");
const authRouter = express.Router();
const User = require("../models/user.js");
const { validateSignupData } = require("../utils/validation.js");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res.json({ message: "User added successfully", data: savedUser });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("All fields are mandatory");
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 3600000),
      });
      res.json(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout successful!");
});

module.exports = authRouter;
