const PurchaseOrder = require('./schema/product')

const createPurchaseOrder = async (PurchaseOrderObject)=>{
    try {
        const purchaseOrder = new PurchaseOrder(PurchaseOrderObject);  
        await purchaseOrder.save();
    } catch (error) {
        return {errorStatus:true,error}
    }

}

const updatePurchaseOrder = async (PurchaseOrderObject)=>{
    try {
        return await PurchaseOrder.findByIdAndUpdate(PurchaseOrderObject._id, PurchaseOrderObject)
    } catch (error) {
        return {errorStatus:true,error}
    }
}


const getSinglePurchaseOrder = async (id)=>{
    try {
        return await PurchaseOrder.findById(id)
    } catch (error) {
        return {errorStatus:true,error}
    }
}

const getAllPurchaseOrder = async()=>{
    try {
        return await PurchaseOrder.find()
            .limit(20);
    } catch (error) {
        return {errorStatus:true,error}
    }
}


const deletePurchaseOrder = async (id)=>{
    try {
        return await PurchaseOrder.findByIdAndDelete(id)
    } catch (error) {
        return {errorStatus:true,error}
    }
}

module.exports = {getAllPurchaseOrder,getSinglePurchaseOrder, createPurchaseOrder,updatePurchaseOrder,deletePurchaseOrder};