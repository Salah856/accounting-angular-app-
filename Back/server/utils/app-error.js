class AppError extends Error {
  constructor(statusCode, message, data, isOperational = true) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.isOperational = isOperational;
  }
}
module.exports = AppError;
