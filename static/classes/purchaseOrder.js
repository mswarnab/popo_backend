class PurchaseOrder{
    constructor(orderNumber,supplierId,dateOfPruchase,products,totalAmount,paidAmount,cerditAmount,dueDate,__v){
        this.orderNumber=orderNumber.trim();
        this.supplierId=supplierId.trim();
        this.dateOfPruchase=dateOfPruchase.trim();
        this.products=products.trim();
        this.totalAmount=totalAmount.trim();
        this.paidAmount=paidAmount.trim();
        this.cerditAmount=cerditAmount.trim();
        this.dueDate=dueDate.trim();
        this.__v = __v;
    }
}

module.exports=PurchaseOrder;