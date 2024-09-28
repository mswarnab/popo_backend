class ErrorObject{
    constructor(status,errorMessage){
        this.status = status;
        this.errorMessage = errorMessage;
        // this.api= api;
        // this.timestamp=timestamp;
    }
}

module.exports = ErrorObject;