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

const validateUpdateData = (data) => {
  const ALLOWED_UPDATES = [
    "lastName",
    "photoUrl",
    "about",
    "skills",
    "age",
    "gender",
  ];

  const isUpdateAllowed = Object.keys(data).every((k) =>
    ALLOWED_UPDATES.includes(k)
  );
  if (!isUpdateAllowed) {
    throw new Error(
      `Invalid update fields. Allowed fields are: ${ALLOWED_UPDATES.join(", ")}`
    );
  }
  if (data.skills) {
    if (!Array.isArray(data.skills)) {
      throw new Error("Skills must be an array");
    }
    if (data.skills.length > 10) {
      throw new Error("Skills array cannot contain more than 10 items");
    }
    if (
      data.skills.some((skill) => typeof skill !== "string" || !skill.trim())
    ) {
      throw new Error("All skills must be non-empty strings");
    }

    data.skills = [...new Set(data.skills.map((skill) => skill.trim()))];
  }
};

module.exports = {
  validateSignupData,
  validateUpdateData,
};
