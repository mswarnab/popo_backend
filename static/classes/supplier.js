class Supplier{
    constructor(id,name,mobileNo,supplierEmail,supplierAddress,lastPurchaseDate,totalCreditAmount){
        this._id=id.trim();
        this.supplierName = name.trim();
        this.supplierContactNo = mobileNo.trim();
        this.supplierEmail=supplierEmail.trim();
        this.supplierAddress=supplierAddress.trim();
        this.lastPurchaseDate=lastPurchaseDate.trim();
        this.totalCreditAmount=totalCreditAmount.trim();
    }
}

module.exports = Supplier;