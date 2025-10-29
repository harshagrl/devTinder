const adminAuth = (req, res, next) => {
  console.log("Admin data is checked");
  const token = "xyz";
  const isAdminAuth = token === "xyz";
  if (!isAdminAuth) {
    res.status(401).send("Unauthourized access");
  } else {
    next();
  }
};
const userAuth = (req, res, next) => {
  console.log("User data is checked");
  const token = "xyz";
  const isUserAuth = token === "xyz";
  if (!isUserAuth) {
    res.status(401).send("Unauthourized access");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
