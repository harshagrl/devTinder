const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user.firstName + " sent connection request");
  } catch (err) {
    return res.status(401).send("ERROR: " + err.message);
  }
});

module.exports = requestRouter;
