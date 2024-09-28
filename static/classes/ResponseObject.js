class ResponseObject{
    constructor(status,message, api, result){
        this.status=status;
        this.message=message;
        this.timestamp=Date.now();
        this.api=api;
        this.result=result;
    }
}

module.exports=ResponseObject;