const AppError = require("../utils/AppError");


//jsonwebtoken err
const handleInvalidTokenError = () => {
  return new AppError('Invlaid token hain', 401)
}

//invalid
const handleTokenExpiredError = () => {
  return new AppError('expired token hain', 401)
}


//handleValidion error

const handleValidationErrorDB = (err) => {

  const errMessage = Object.values(err.error).map(el => el.message)

  const message = `invalid Input data ${errMessage.join(', ') }`
  return new AppError(message, 400)
}

// it will occur when we insert the duplicate value : errname duplicate key error code 11000
const handleDuplicateErrorDB = (err) => {
  const value = err.keyValue.email;
  const message = `Duplicate field value is :${value} please enter another value`;
  return new AppError(message, 409);
};

// handleCastErrorDB when the  _id is wrong
const handleCastErrorDB = (err) => {
  const message = ` Invalid  :${err.path} and value : ${err.value}`;
  return new AppError(message, 400);
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went very wrong",
    });
  }
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "ERROR";

  let error = {
    ...err,
    name: err.name,
    message: err.message,
    stack: err.stack,
  };

  if (process.env.NODE_ENV === "development") {
    if (error.name === "CastError") error.statusCode = 400;
    if (error.code === 11000) error.statusCode = 409;
    if (error.name === 'ValidationError') error.statusCode = 400;

    if (error.name === 'JsonWebTokenError') error.statusCode = 401;

    if (error.name === 'TokenExpiredError') error.statusCode = 401;

    sendErrorDev(error, res);
  }

  else if (process.env.NODE_ENV === "production") {
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateErrorDB(error);

    if (error.name === 'ValidationError') error = handleValidationErrorDB(error)

    if (error.name === 'JsonWebTokenError') error = handleInvalidTokenError(error);

    if (error.name === 'TokenExpiredError') error = handleTokenExpiredError(error);

    sendErrorProd(error, res);
  }
};



// developers -- deeply
// production -- dont show unknown error




