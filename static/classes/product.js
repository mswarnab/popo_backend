module. exports = class Product {
    constructor(productName,category,supplierName,purchaseOrderId,purchaseDate, mfgDate, expDate, quantity, purchasePrice, mrp, batchNumber,__v){
        this.productName= productName.trim();
        this.category = category.trim();
        this.supplierName = supplierName.trim();
        this.purchaseOrderId = purchaseOrderId.trim();
        this.purchaseDate = purchaseDate.trim();
        this.mfgDate = mfgDate.trim();
        this.expDate = expDate.trim();
        this.quantity = parseInt(quantity);
        this.purchasePrice = parseInt(purchasePrice) ;
        this.mrp = parseInt(mrp);
        this.batchNumber= batchNumber.trim();
        this.__v = __v;
    }
}