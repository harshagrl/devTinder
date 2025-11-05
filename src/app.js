require("dotenv").config();
const express = require("express");
const app = express();
const User = require("./models/user");
const connectDB = require("./config/database.js");
const {
  validateSignupData,
  validateUpdateData,
} = require("./utils/validation.js");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cookieParser());
app.post("/signup", async (req, res) => {
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
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("All fields are mandatory");
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = await jwt.sign({ _id: user._id }, "Dev@Tinder123//");
      res.cookie("token", token);

      res.send("Login Successful!!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});
app.get("/profile", async (req, res) => {
  const cookies = req.cookies;
  const { token } = cookies;
  if (!token) {
    return res.status(401).send("Unauthorized: No token provided");
  }
  try {
    const decoded = jwt.verify(token, "Dev@Tinder123//");
    const userId = decoded._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (err) {
    return res.status(401).send("Unauthorized: Invalid token");
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

app.delete("/deleteuser", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted Successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.patch("/updateuser/:userId", async (req, res) => {
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
