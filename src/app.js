const express = require("express");
const app = express();

const { adminAuth, userAuth } = require("./middlewares/auth");

app.use("/admin", adminAuth);

app.get("/user", userAuth, (req, res) => {
  res.send("User is here");
});

app.get("/admin/getAllData", (req, res) => {
  res.send("Sent all data");
});

app.get("/admin/deleteData", (req, res) => {
  res.send("delete a user data");
});

// app.get("/user/:userId/:name/:pass", (req, res) => {
//   console.log(req.params);
//   res.send({ name: "harsh", age: 21 });
// });
// app.get("/user", (req, res) => {
//   res.send({ name: "harsh", age: 22 });
// });
// app.post("/user", (req, res) => {
//   res.send("post user page");
// });
// app.delete("/user", (req, res) => {
//   res.send("delete user page");
// });
// app.patch("/user", (req, res) => {
//   res.send("patch user page");
// });
// app.put("/user", (req, res) => {
//   res.send("put user page");
// });
// app.use("/", (req, res) => {
//   res.send("Hello harsh!");
// });
app.listen(3000, () => {
  console.log("Server is running at port 3000");
});
