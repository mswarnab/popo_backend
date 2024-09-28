const Sale = require('./schema/product')

const createSale = async (saleObject)=>{
    try {
        const sale = new Sale(saleObject);  
        await sale.save();
    } catch (error) {
        return {errorStatus:true,error}
    }

}

const updateSale = async (saleObject)=>{
    try {
        return await Sale.findByIdAndUpdate(saleObject._id, saleObject)
    } catch (error) {
        return {errorStatus:true,error}
    }
}


const getSingleSale = async (id)=>{
    try {
        return await Sale.findById(id);
    } catch (error) {
        return {errorStatus:true,error}
    }
}

const getAllSale = async()=>{
    try {
        return await Sale.find()
            .limit(20);
    } catch (error) {
        return {errorStatus:true,error}
    }
}


const deleteSale = async (id)=>{
    try {
        return await Sale.findByIdAndDelete(id)
    } catch (error) {
        return {errorStatus:true,error}
    }
}

module.exports = {getAllSale,getSingleSale, createSale,updateSale,deleteSale};