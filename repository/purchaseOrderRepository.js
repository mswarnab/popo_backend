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

// const getSortedPurchasedOrderBasedOnDateOfPurchase = async()=>{
//     try {
//         const count = await PurchaseOrder.find()
//                                         .sort({dateOfPruchase:1})
//                                         .countDocuments()
//         const result = await PurchaseOrder.find()
//                                         .sort({dateOfPruchase:1})
//                                         .limit(20);
//         return {count, result};                                
//     } catch (error) {
//         return {errorStatus:true,error}
//     }
// }

const getAllPurchaseOrder = async (startDate=new Date(),endDate=new Date(currentDate.setMonth(currentDate.getMonth() + 3 )))=>{
    try {
        const count = await PurchaseOrder.find()
                                        .where("dateOfPruchase")
                                        .gte(endDate)
                                        .lte(startDate)
                                        .sort({dateOfPruchase:-1})
                                        .countDocuments();
        const result = await PurchaseOrder.find()
                                        .where("dateOfPruchase")
                                        .gte(endDate)
                                        .lte(startDate)
                                        .sort({dateOfPruchase:-1})
                                        .limit(20);
        return {count,result};
    } catch (error) {
        return {errorStatus:true,error}  
    }
}

// const getPurchaseOrdersBasedOnSortedCredit = async()=>{
//     try {
//         const count = await PurchaseOrder.find()
//                                         .sort({cerditAmount:-1})
//                                         .countDocuments()
//         const result = await PurchaseOrder.find()
//                                         .sort({cerditAmount:-1})
//                                         .limit(20);
//         return {count, result};                                
//     } catch (error) {
//         return {errorStatus:true,error}
//     }
// }

// const getPurchaseOrdersBasedOnPurchaseDate = async (startDate,endDate) =>{
//     try {
//         const count = await PurchaseOrder.find()
//                                         .where("dateOfPruchase")
//                                         .gte(startDate)
//                                         .lte(endDate)
//                                         .countDocuments();
//         const result = await PurchaseOrder.find()
//                                         .where("dateOfPruchase")
//                                         .gte(startDate)
//                                         .lte(endDate)
//                                         .limit(20);
//         return {count,result};
//     } catch (error) {
//         return {errorStatus:true,error}  
//     }
// }


const deletePurchaseOrder = async (id)=>{
    try {
        return await PurchaseOrder.findByIdAndDelete(id)
    } catch (error) {
        return {errorStatus:true,error}
    }
}

module.exports = {getAllPurchaseOrder,getSinglePurchaseOrder, createPurchaseOrder,updatePurchaseOrder,deletePurchaseOrder};