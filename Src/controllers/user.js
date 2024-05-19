const User = require("../models/user");
const cookieToken = require("../utils/token");
const cloudinary = require("cloudinary");
const mailhelper = require("../utils/mailhelper");
const crypto = require("crypto");

exports.signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!email || !name || !password) {
    return next(new Error("Name, email, and password are required", 400));
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  cookieToken(user, res);
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new Error("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new Error("Email or password does not match or exist", 400));
  }

  const isPasswordCorrect = await user.isValidatedPassword(password);

  if (!isPasswordCorrect) {
    return next(new Error("Email or password does not match or exist", 400));
  }

  cookieToken(user, res);
};

exports.logout = (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logout success",
  });
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return next(new Error("Email not found as registered", 400));
    }

    const forgotToken = user.generateForgotPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get("host")}/api/password/reset/${forgotToken}`;
    const message = `Copy paste this link in your URL:\n ${resetUrl}`;

    await mailhelper({
      email: user.email,
      subject: "Online Store - Password Reset Mail",
      message,
    });

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new Error(error.message));
  }
};

exports.passwordReset = async (req, res, next) => {
  try {
    const token = req.params.token;
    const encryToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      forgotPasswordToken: encryToken,
      forgotPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return next(new Error("Token is invalid or expired", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
      return next(new Error("Password and confirm password do not match", 400));
    }

    user.password = req.body.password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save();

    cookieToken(user, res);
  } catch (error) {
    return next(error);
  }
};

exports.getLoggedInUserDetails = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
};

exports.changePassword = async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId).select("+password");

  const isCorrectOldPassword = await user.isValidatedPassword(req.body.oldPassword);

  if (!isCorrectOldPassword) {
    return next(new Error("Old password is incorrect", 400));
  }

  user.password = req.body.password;
  await user.save();
  cookieToken(user, res);
};

exports.updateUserDetails = async (req, res, next) => {
  const newData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.files) {
    const user = await User.findById(req.user.id);
    const imageId = user.photo.id;

    await cloudinary.v2.uploader.destroy(imageId);

    const result = await cloudinary.v2.uploader.upload(req.files.photo.tempFilePath, {
      folder: "users",
      width: 150,
      crop: "scale",
    });

    newData.photo = {
      id: result.public_id,
      secure_url: result.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
};

exports.adminAllUser = async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
};

exports.admingetOneUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new Error("No user found", 400));
  }

  res.status(200).json({
    success: true,
    user,
  });
};

exports.adminUpdateOneUserDetails = async (req, res, next) => {
  const newData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
};

exports.adminDeleteOneUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new Error("No Such user found", 401));
  }

  const imageId = user.photo.id;

  await cloudinary.v2.uploader.destroy(imageId);
  await user.remove();

  res.status(200).json({
    success: true,
  });
};

exports.managerAllUser = async (req, res, next) => {
  const users = await User.find({ role: "user" });

  res.status(200).json({
    success: true,
    users,
  });
};
