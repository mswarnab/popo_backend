const mongoose = require('mongoose');

const saleReceiptSchema = new mongoose.Schema({
    billNumber: String,
    customerId:String,
    dateOfSale: {type: Date,default:Date.now},
    products:[{productId: String,quantity:Number,purchasePrice:Number, mrp:Number, sellingPrice:Number, discountPercentage:Number }],
    totalAmount:Number,
    paidAmount: Number,
    cerditAmount: Number,
    dueDate: Date
})

module.exports = mongoose.model('SaleReceipt',saleReceiptSchema);