require("dotenv").config();
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      maxLength: 30,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong enough");
        }
      },
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      // validate(value) {
      //   if (!["male", "female", "others"].includes(value)) {
      //     throw new Error("Gender is not valid");
      //   }
      // },
      enum: {
        values: ["male", "female", "others"],
        message: `{VALUE} is not a valid gender type.`,
      },
      trim: true,
    },
    about: {
      type: String,
      default: "This is the default about.",
      trim: true,
      maxLength: 100,
    },
    skills: {
      type: [String],
      validate: {
        validator: function (array) {
          return array.length <= 10;
        },
        message: "Skills array cannot contain more than 10 items",
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://www.freeiconspng.com/thumbs/person-icon/clipart--person-icon--cliparts-15.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Photo URL is not valid");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const hashedPassword = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    hashedPassword
  );
  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
