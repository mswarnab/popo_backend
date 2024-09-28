const Supplier = require('./schema/product')

const createSupplier = async (supplierObject)=>{
    try {
        const supplier = new Supplier(supplierObject);  
        await supplier.save();
    } catch (error) {
        return {errorStatus:true,error}
    }

}

const updateSupplier = async (supplierObject)=>{
    try {
        return await Supplier.findByIdAndUpdate(supplierObject._id, supplierObject)
    } catch (error) {
        return {errorStatus:true,error}
    }
}


const getSingleSupplier = async (id)=>{
    try {
        const result = await Supplier.findById(id);
       return {count:result,result};
    } catch (error) {
        return {errorStatus:true,error}
    }
}

const getAllSupplier = async()=>{
    try {
        const count = await Supplier.find()                           
                                    .countDocuments();

        const result = await Supplier.find()
                                    .sort({lastPurchaseDate: -1})
                                    .limit(20);
        return {count,result};
    } catch (error) {
        return {errorStatus:true,error}
                    
    }
}


const deleteSupplier = async (id)=>{
    try {
        return await Supplier.findByIdAndDelete(id)
    } catch (error) {
        return {errorStatus:true,error}
    }
}

const getSearchResult = async (regex)=>{
    try {
        const result = await Supplier.find()
                                    .select("supplierName")
                                    .distinct()
                                    .where("supplierName")
                                    .regex(regex)
                                    .limit(10)
        return {count:10,result};
    } catch (error) {
        return {errorStatus:true,error}
    }
}

const getSuppliersOnRegex = async(regex)=>{
    try {
        const count = await Supplier.find()
                                    .where("supplierName")
                                    .regex(regex)
                                    .countDocuments();

        const result = await Supplier.find()
                                    .where("supplierName")
                                    .regex(regex)
                                    .countDocuments();
        return {count,result};
    } catch (error) {
        return {errorStatus:true,error}       
    }
}

const getSuppliersHavingCredit = async()=>{
    try {
        const count = await Supplier.find()
                                    .where("totalCreditAmount")
                                    .gt(0)
                                    .countDocuments();
        const result = await Supplier.find()
                                    .where("totalCreditAmount")
                                    .gt(0)
                                    .sort({totalCreditAmount:-1})
                                    .limit(20);
        return {count,result};
    } catch (error) {
        return {errorStatus:true,error}       
    }
}


module.exports = {getAllSupplier,getSingleSupplier, createSupplier,updateSupplier,deleteSupplier,getSearchResult,getSuppliersOnRegex,getSuppliersHavingCredit};