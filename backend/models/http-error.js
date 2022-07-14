class httpError extends Error {
  constructor(message, errorCode) {
    super();
    this.message = message;
    this.code = errorCode;
  }
}

module.exports = httpError;
