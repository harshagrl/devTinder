const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please Login!");
    }

    const decoded = jwt.verify(token, "Dev@Tinder123//");
    const userId = decoded._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).send("ERROR: " + err.message);
  }
};

module.exports = {
  userAuth,
};
