const { Error } = require('mongoose').Error;
const User = require('../models/user');
const cookieParser = require('cookie-parser');
const Jwt = require('jsonwebtoken');
const crypto=require('crypto')
const token=require('../utils/token')

exports.loggedIn = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.replace("Bearer ", "")

    if (!token) {
        // return next(new Error('login first to access this page'));
        const error=new Error("hiii");
        return next(error)
    }

    try {
        const decoded = Jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        next(error); // Forward the error to the error handler middleware
    }
};

// exports.loggedIn = (req, res, next) => {
//     // Check if token is present in cookies or authorization header
//     const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.replace("Bearer ", ""));

//     if (!token) {
//         return res.status(401).json({ message: "Unauthorized: Missing token" });
//     }

//     // Here, you can proceed with your authentication logic using the token
//     // For example, verify the token and attach user information to the request object

//     next(); // Call next middleware
// };
// exports.loggedIn = (req, res, next) => {
//     console.log("hiiii");
//     // Check if token is present in cookies or authorization header
//     const token =  (req.headers.authorization && req.headers.authorization.replace("Bearer ", ""));
//     console.log(token);

//     if (!token) {
//         return res.status(401).json({ message: "Unauthorized: Missing token" });
//     }
// console.log(req.cookies,"cookied")
//     // Here, you can proceed with your authentication logic using the token
//     // For example, verify the token and attach user information to the request object

//     next(); // Call next middleware
// };
