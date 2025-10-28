const express = require("express");
const app = express();

app.use("/home", (req, res) => {
  res.send("Hello home page!");
});
app.use("/login", (req, res) => {
  res.send("Login done!");
});
app.use("/", (req, res) => {
  res.send("Hello harsh!");
});
app.listen(3000, () => {
  console.log("Server is running at port 3000");
});
