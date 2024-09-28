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
        const result = await Customer.findById(id);
       return {count:result,result};
    } catch (error) {
        return {errorStatus:true,error}
    }
}

const getAllCustomer = async(page)=>{
    try {
        const count = await Customer.find()
                                    .countDocuments();

        const result = await Customer.find()
                                    .sort({lastPurchaseDate: -1})
                                    .skip(20*parseInt(page))
                                    .limit(20);
        return {count,result};
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

const getSearchResult = async (regex)=>{
    try {
        const result = await Customer.find()
                                    .select("customerName")
                                    .distinct()
                                    .where("customerName")
                                    .regex(regex)
                                    .limit(10)
        return {count:10,result};
    } catch (error) {
        return {errorStatus:true,error}
    }
}

const getCustomersOnRegex = async(regex)=>{
    try {
        const count = await Customer.find()
                                    .where("customerName")
                                    .regex(regex)
                                    .countDocuments();

        const result = await Customer.find()
                                    .where("customerName")
                                    .regex(regex)
                                    .countDocuments();
        return {count,result};
    } catch (error) {
        return {errorStatus:true,error}       
    }
}

const getCustomersHavingCredit = async(page)=>{
    try {
        const count = await Customer.find()
                                    .where("totalCreditAmount")
                                    .gt(0)
                                    .countDocuments();
        const result = await Customer.find()
                                    .where("totalCreditAmount")
                                    .gt(0)
                                    .sort({totalCreditAmount:1})
                                    .skip(20* parseInt(page))
                                    .limit(20);
        return {count,result};
    } catch (error) {
        return {errorStatus:true,error}       
    }
}

module.exports = {getAllCustomer,getSingleCustomer, createCustomer,updateCustomer,deleteCustomer,getSearchResult,getCustomersOnRegex,getCustomersHavingCredit};