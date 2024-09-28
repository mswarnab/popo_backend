const Customer = require('./schema/product')

const createCustomer = async (customerObject)=>{
    try {
        const customer = new Customer(customerObject);  
        await customer.save();
    } catch (error) {
        return {errorStatus:true,error}
    }

}

const updateCustomer = async (customerObject)=>{
    try {
        return await Customer.findByIdAndUpdate(customerObject._id, customerObject)
    } catch (error) {
        return {errorStatus:true,error}
    }
}


const getSingleCustomer = async (id)=>{
    try {
        return await Customer.findById(id)
    } catch (error) {
        return {errorStatus:true,error}
    }
}

const getAllCustomer = async()=>{
    try {
        return await Customer.find()
            .limit(20);
    } catch (error) {
        return {errorStatus:true,error}
    }
}


const deleteCustomer = async (id)=>{
    try {
        return await Customer.findByIdAndDelete(id)
    } catch (error) {
        return {errorStatus:true,error}
    }
}

module.exports = {getAllCustomer,getSingleCustomer, createCustomer,updateCustomer,deleteCustomer};