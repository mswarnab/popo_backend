class Supplier{
    constructor(id,name,mobileNo,supplierEmail,supplierAddress,lastPurchaseDate,totalCreditAmount,__V){
        this._id=id.trim();
        this.supplierName = name.trim();
        this.supplierContactNo = mobileNo.trim();
        this.supplierEmail=supplierEmail.trim();
        this.supplierAddress=supplierAddress.trim();
        this.lastPurchaseDate=lastPurchaseDate.trim();
        this.totalCreditAmount=totalCreditAmount.trim();
        this.__V = __V.trim();
    }
}

module.exports = Supplier;