const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, email, password } = req.body;
  if (!firstName) {
    throw new Error("Please enter a name");
  } else if (!validator.isEmail(email)) {
    throw new Error("Please enter a valid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

module.exports = {
  validateSignupData,
};
