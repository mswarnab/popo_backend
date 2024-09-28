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

const getAllSale = async(page,sortBy="dateOfSale",sortValue=-1,filterObj={totalAmount: {$gt:0}})=>{
    try {
        const count = await Sale.find(filterObj)
                                .sort({[sortBy]:sortValue})
                                .countDocuments();

        const result = await Sale.find(filterObj)
                                .sort({[sortBy]:sortValue})
                                .skip(20*parseInt(page))
                                .limit(20);
        return {count,result};
            
    } catch (error) {
        return {errorStatus:true,error}
    }
}

const getTotalSaleOfCustomers = async(id,page,filterDue)=>{
    try {
        if(filterDue){
            const count = await Sale.find()
                                    .where("customerId")
                                    .equals(id)
                                    .where("cerditAmount")
                                    .equals(0)
                                    .sortBy({dateOfSale: -1})
                                    .countDocuments();
            const result = await Sale.find()
                                    .where("customerId")
                                    .equals(id)
                                    .where("cerditAmount")
                                    .equals(0)
                                    .skip(20*parseInt(page))
                                    .sortBy({dateOfSale: -1})                                   
                                    .countDocuments();  
            return {count, result};
        }


        const count = await Sale.find()
                                .where("customerId")
                                .equals(id)
                                .sortBy({dateOfSale: -1})
                                .countDocuments();
        const result = await Sale.find()
                                .where("customerId")
                                .equals(id)
                                .skip(20*parseInt(page))
                                .sortBy({dateOfSale: -1})                                   
                                .countDocuments();  
        return {count, result};
          
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

const getSaleBasedOnCustomerId = async (page,id)=>{
    try {
        const count = await Sale.find()
                                .where("customerId")
                                .equals(id)
                                .countDocuments();
        const result = await Sale.find()
                                .where("customerId")
                                .equals(id)
                                .sort({dateOfSale: -1})
                                .skip(20 * parseInt(page))
                                .limit(20);     
        return {result,count};                       
    } catch (error) {
        
    }

}

module.exports = {getAllSale,getSingleSale, createSale,updateSale,deleteSale,getTotalSaleOfCustomers,getSaleBasedOnCustomerId};