const express = require("express");
const app = express();

app.get("/user", (req, res) => {
  res.send("get user page");
});
app.post("/user", (req, res) => {
  res.send("post user page");
});
app.delete("/user", (req, res) => {
  res.send("delete user page");
});
app.patch("/user", (req, res) => {
  res.send("patch user page");
});
app.put("/user", (req, res) => {
  res.send("put user page");
});
app.use("/", (req, res) => {
  res.send("Hello harsh!");
});
app.listen(3000, () => {
  console.log("Server is running at port 3000");
});
