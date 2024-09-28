const { productCategory } = require('../static');
const Product = require('./schema/product')

const createProduct = async (productObject)=>{
    try {
        const product = new Product(productObject);  
        return await product.save();
    } catch (error) {
        return {errorStatus:true,error}
    }
}

const updateProduct = async (id, productObject)=>{
    try {
        return await Product.findByIdAndUpdate(id, productObject,{new: true})
    } catch (error) {
        return {errorStatus:true,error}
    }
}


const getSingleProduct = async (id)=>{
    try {
        const result = await Product.findById(id)
        return {count: result , result}
    } catch (error) {
        return {errorStatus:true,error}
    }
}

const getAllProducts = async(sortByField,sortByValue,filterByField,filterByValue)=>{
    try {
        let count;
        let result;
        console.log(sortByField)
        console.log(sortByValue)
        console.log(filterByField)
        console.log(filterByValue)

        if(sortByField && filterByField ){
            count = await Product.find()
                .sort({[sortByField]:parseInt(sortByValue)})
                .where(filterByField)
                .equals(filterByValue)
                .countDocuments();
            result = await Product.find()
                .sort({[sortByField]:parseInt(sortByValue)})
                .where(filterByField)
                .equals(filterByValue)        
                .limit(20);
            console.log("sort && filter")
        }

        if(sortByField && !filterByField){
            count = await Product.find()
                        .sort({[sortByField]:parseInt(sortByValue)})
                        .countDocuments();
            result = await Product.find()
                        .sort({[sortByField]:parseInt(sortByValue)})       
                        .limit(20);
            console.log("sort")
        }

        if(!sortByField && filterByField){
            count = await Product.find()
                        .where(filterByField)
                        .equals(filterByValue)
                        .countDocuments();
            result = await Product.find()
                        .where(filterByField)
                        .equals(filterByValue)        
                        .limit(20); 
            console.log(" filter")
        }

        if(!sortByField && !filterByField){
            count = await Product.find()       
                                .countDocuments();
            result = await Product.find()       
                                .limit(20);
            console.log("nothing")
        }

        return {count,result};

    } catch (error) {
        return {errorStatus:true,error}
    }
}


const deleteProduct = async (id)=>{
    try {
        return await Product.findByIdAndDelete(id)
    } catch (error) {
        return {errorStatus:true,error}
    }
}

const getExpiredProducts = async (category=productCategory,duration=3)=>{
    const currentDate = new Date();
    const notificationDate = new Date(currentDate.setMonth(currentDate.getMonth() + parseInt(duration) ));
    try {
        const count = await Product.find()
        .where("category")
        .in(typeof(category) == "object"? category : [category] )
        .where("expDate")
        .lte(notificationDate)
        .countDocuments();

        const result = await Product.find()
        .where("category")
        .in(typeof(category) == "object"? category : [category] )
        .where("expDate")
        .lte(notificationDate)
        .sort({expDate:1})
        .limit(20);

        return {count,result};

    } catch (error) {
        return {errorStatus:true,error}
    }
}

const getSearchResult = async (regex)=>{
    try {
        const result =  await Product.find()
                    .select("productName")
                    .distinct()
                    .where("productName")
                    .regex(regex)
                    .limit(10)  
        return {count:10,result}  
    } catch (error) {
        return {errorStatus:true,error}
    }
}

const getProductsOnRegex = async (regex)=>{
    try {
        const count =  await Product.find()
                                    .where("productName")
                                    .regex(regex)
                                    .countDocuments(); 

        const result =  await Product.find()
                                    .where("productName")
                                    .regex(regex)
                                    .limit(10)  
        return {count,result}  
    } catch (error) {
        return {errorStatus:true,error}
    }
}
module.exports = {getAllProducts,getSingleProduct, createProduct,updateProduct,deleteProduct,getExpiredProducts,getSearchResult,getProductsOnRegex};