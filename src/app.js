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
app.use(express.json());
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
    console.log("Attempting update for user:", userId);
    console.log("Update data:", data);
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
