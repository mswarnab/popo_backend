class ErrorObject {
  constructor(status, errorCode, errorMessage, api, path, method, data) {
    this.status = status;
    this.error = true;
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
    this.api = api;
    this.path = path;
    this.method = method;
    this.timestamp = new Date();
    this.data = data;
  }
}

module.exports = ErrorObject;
