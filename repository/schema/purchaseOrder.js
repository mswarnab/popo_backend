const mongoose = require('mongoose');

const purchaseOrdertSchema = new mongoose.Schema({
    orderNumber: String,
    supplierId:String,
    dateOfPruchase: {type: Date,default:Date.now},
    products:[{productId: String,quantity:Number }],
    totalAmount:Number,
    paidAmount: Number,
    cerditAmount: Number,
    dueDate: Date
})

module.exports = mongoose.model('PurchaseOrder',purchaseOrdertSchema);
