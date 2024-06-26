const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.isLoggedIn = (async (req, res, next) => {
  //const token = req.cookies.token || req.header("Authorization").replace("Bearer ", "");
  let token = req.cookies.token;

  // if token not found in cookies, check if header contains Auth field
  if (!token && req.header("Authorization")) {
    token = req.header("Authorization").replace("Bearer ", "");
  }

  if (!token) {
    return next(new Error("Login first to access this page", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded.id);

  next();
});

exports.customRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new Error("You are not allowed for this resouce", 403));
    }
    console.log(req.user.role);
    next();
  };
};