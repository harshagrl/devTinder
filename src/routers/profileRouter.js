const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const User = require("../models/user");
const { validateUpdateData } = require("../utils/validation.js");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    return res.status(401).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const data = req.body;

    validateUpdateData(data);
    const user = req.user;

    if (!user) {
      return res.status(404).send("User not found");
    }
    Object.keys(data).forEach((key) => {
      user[key] = data[key];
    });
    await user.save();
    res.json({
      message: `${user.firstName}, your profile was updated successfully`,
      data: user,
    });
  } catch (err) {
    res.status(400).send("Update failed: " + err.message);
  }
});

profileRouter.post("/profile/passwordChange", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      throw new Error("All fields are mandatory");
    }
    if (oldPassword === newPassword) {
      throw new Error("New password must be different from old password");
    }
    const isOldPasswordValid = await user.validatePassword(oldPassword);
    if (!isOldPasswordValid) {
      throw new Error("Old password is incorrect");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.send("Password changed successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});
module.exports = profileRouter;
