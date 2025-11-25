require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://intellidocs:%40Intellidocs654%2F%2F@cluster0.oj9qf9p.mongodb.net/devTinder?retryWrites=true&w=majority&appName=Cluster0"
  );
};

module.exports = connectDB;
