class Sale{
    constructor(id,billNumber,customerId,dateOfSale,products,totalAmount,paidAmount,cerditAmount,dueDate,__v){
        this.billNumber = billNumber.trim();
        this.customerId=customerId.trim();
        this.dateOfSale=dateOfSale.trim();
        this.products=products.trim();
        this.totalAmount=totalAmount.trim();
        this.paidAmount=paidAmount.trim();
        this.cerditAmount=cerditAmount.trim();
        this.dueDate=dueDate.trim();
        this.__V = __V.trim();
    }
}

module.exports = Sale;