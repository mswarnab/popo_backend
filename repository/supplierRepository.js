const Supplier = require('./schema/product')

const createSupplier = async (SupplierObject)=>{
    try {
        const supplier = new Supplier(SupplierObject);  
        await supplier.save();
    } catch (error) {
        return {errorStatus:true,error}
    }

}

const updateSupplier = async (SupplierObject)=>{
    try {
        return await Supplier.findByIdAndUpdate(SupplierObject._id, SupplierObject)
    } catch (error) {
        return {errorStatus:true,error}
    }
}


const getSingleSupplier = async (id)=>{
    try {
        return await Supplier.findById(id)
    } catch (error) {
        return {errorStatus:true,error}
    }
}

const getAllSupplier = async()=>{
    try {
        return await Supplier.find()
            .limit(20);
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

module.exports = {getAllSupplier,getSingleSupplier, createSupplier,updateSupplier,deleteSupplier};