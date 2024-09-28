const mongoose = require('mongoose');
const staticData = require('../../static');

const productSchema = new mongoose.Schema({
    productName:String,
    category: String,
    supplierName: String,
    purchaseOrderId: String,
    purchaseDate: {type: Date, default:Date.now()},
    mfgDate: Date,
    expDate: Date,
    quantity: Number,
    purchasePrice:Number,
    mrp: Number,
    batchNumber: String,
})

module.exports = mongoose.model('Product',productSchema) ;
