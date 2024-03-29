const AppError = require('../utils/appError');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error, don't leak error details
  } else {
    // 1) Log Error
    console.error('Error : ', err);

    // Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Somthing went wrong',
    });
  }
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}, ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldDB = (err) => {
  const firstKey = Object.keys(err.keyValue)[0];
  const firstValue = Object.values(err.keyValue)[0];
  const message = `Duplicate ${firstKey} value: ${firstValue}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid Input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') {
      err = handleCastErrorDB(err);
    } else if (err.code === 11000) {
      err = handleDuplicateFieldDB(err);
    } else if (err.name === 'ValidationError') {
      err = handleValidationErrorDB(err);
    }

    sendErrorProd(err, res);
  }
};
