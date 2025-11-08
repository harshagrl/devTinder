const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const User = require("../models/user");
const { validateUpdateData } = require("../utils/validation.js");

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    return res.status(401).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/updateuser/:userId", async (req, res) => {
  // //update user based on email
  // const { email, ...data } = req.body;
  // try {
  //   const user = await User.findOneAndUpdate(
  //     { email },
  //     { $set: data },
  //     {
  //       returnDocument: "after",
  //     }
  //   );
  //   res.send(user);
  // } catch (err) {
  //   res.status(400).send("Something went wrong");
  // }

  // update user based on id
  try {
    const userId = req.params?.userId;
    const data = req.body;

    validateUpdateData(data);
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: data },
      {
        new: true,
        returnDocument: "after",
        runValidators: true,
        context: "query",
      }
    );
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("Update failed: " + err.message);
  }
});

module.exports = profileRouter;
