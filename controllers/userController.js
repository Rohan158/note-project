const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { promisify } = require("node:util");

const signToken = (id) => {
  return jwt.sign(id, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  const token = signToken({ id: user._id });
  res.status(201).json({
    status: "success",
    token,
    Data: {
      user,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  const token = signToken({ id: user._id });

  res.status(200).json({
    status: "success",
    token,
    Data: {
      user,
    },
  });
});



exports.protect = catchAsync(async (req, res, next) => {
  //1) getting the token and check is there
  let token = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("your not loggin ,please login again", 401));
  }
  //2) vefiifying token

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  console.log(decode);

  //3 checking still user is exists or not

  const currentuser = await User.findById(decode.id)
  if (!currentuser) {
    return next(new AppError('This token belonging user doesnot exist longer', 401))
  }

  req.user = currentuser
  console.log(req.user.role)
  next();
});

exports.ristrictTo = (...roles) => {
  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {
      return next(new AppError('you dont have persmisiion to perform ', 403));
    }
    next();
  }
}
