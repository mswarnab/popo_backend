class Customer {
    constructor(name,mobileNo,address,lastPurchaseDate,totalCreditAmount,__v){
        this.customerName=name.trim();
        this.customerContactNo=mobileNo.trim();
        this.customerAddress=address.trim();
        this.lastPurchaseDate=lastPurchaseDate.trim(),
        this.totalCreditAmount=totalCreditAmount.trim();
        this.__v=__v;
    }
}

module.exports = Customer;