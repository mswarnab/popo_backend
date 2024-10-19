class ResponseObject {
  constructor(status, method, message, api, path, result) {
    this.status = status;
    this.error = false;
    this.method = method;
    this.message = message;
    this.timestamp = new Date();
    this.api = api;
    this.path = path;
    this.result = result;
  }
}

module.exports = ResponseObject;
