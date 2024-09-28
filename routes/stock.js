const router = require('express').Router();
const {httpCodes}=require('../static')

const productRepository = require('../repository/productRepository');
const ResponseObject = require('../static/classes/ResponseObject');
const ErrorObject = require('../static/classes/errorObject');
const Product = require('../static/classes/product');
const validateReqBody = require('../static/validation/validateProduct');

router.get('/getexpiredproducts',async(req,res)=>{
    

    try {
        const {category,duration}  = req.query;
        const {count,error ,result} = await productRepository.getExpiredProducts(category,duration);

        if(!count){
            return res.status(httpCodes.NOT_FOUND).send(new ErrorObject(httpCodes.NOT_FOUND,"Product not found.",'/',{count,result}));
        }

        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"Product fetched successfully.",'/',{count,result}));
    
    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/'));       
    }    
});

router.get('/searchproducts',async(req,res)=>{
    

    try {
        const {pattern}  = req.query;
        const {count,error ,result} = await productRepository.getSearchResult(pattern);

        if(!count){
            return res.status(httpCodes.NOT_FOUND).send(new ErrorObject(httpCodes.NOT_FOUND,"Product not found.",'/',{count,result}));
        }

        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"Product fetched successfully.",'/',{count,result}));
    
    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/'));       
    }    
});

router.get('/findproductwithname',async(req,res)=>{
    
    try {
        const {pattern}  = req.query;
        const {count,error ,result} = await productRepository.getProductsOnRegex(pattern);

        if(!count){
            return res.status(httpCodes.NOT_FOUND).send(new ErrorObject(httpCodes.NOT_FOUND,"Product not found.",'/',{count,result}));
        }

        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"Product fetched successfully.",'/',{count,result}));
    
    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/'));       
    }    
});

router.get('/', async(req,res)=>{
    try {
        const {sortByField,sortByValue,filterByField,filterByValue} = req.query;
        console.log(req.query)
        const {count,error, result} = await productRepository.getAllProducts(sortByField,sortByValue,filterByField,filterByValue);
        if(!count){
            return res.status(httpCodes.NOT_FOUND).send(new ErrorObject(httpCodes.NOT_FOUND,"Product not found.",'/',{count,result}));
        }
        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"Product fetched successfully.",'/',{count,result}));
    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/'));
    }
});

router.get('/:id',async (req,res)=>{
    try {
        const {id} = req.params; 
        const product = await productRepository.getSingleProduct(id);
        if(!product){
            return res.status(httpCodes.NOT_FOUND).send(new ErrorObject(httpCodes.NOT_FOUND,"Product not found.",'/',product));
        }
        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"Product fetched successfully.",'/',product));
    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/'));
    }
});

router.post('/addstock',async(req,res)=>{  
    try {
        const {productName,category,supplierName,purchaseOrderId,purchaseDate, mfgDate, expDate, quantity, purchasePrice, mrp, batchNumber,__v=0} = req.body;
        const product = new Product(productName,category,supplierName,purchaseOrderId,purchaseDate, mfgDate, expDate, quantity, purchasePrice, mrp, batchNumber,__v);
        
        // Validate request body 
        const {error,value,warning} = validateReqBody(product);
        
        // If there is error in request body, then it will throw BAD request 
        if(error){
            return res.status(httpCodes.BAD_REQUEST).send(new ErrorObject(httpCodes.BAD_REQUEST,error.message));
        }

        //otherwise create product Repository is invoked.
        const productObj = await productRepository.createProduct(product);

        // Successful response 
        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"Product added successfully.",'/',productObj));

    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/'));
    }
});

router.put('/updatestock/:id',async (req,res)=>{
    try {
        const {id} = req.params; 
        const {productName,category,supplierName,purchaseOrderId,purchaseDate, mfgDate, expDate, quantity, purchasePrice, mrp, batchNumber,__v} = req.body;
        const product = new Product(productName,category,supplierName,purchaseOrderId,purchaseDate, mfgDate, expDate, quantity, purchasePrice, mrp, batchNumber,__v);
        
        // Validate request body 
        const {error,value,warning} = validateReqBody(product);
        
        // If there is error in request body, then it will throw BAD request 
        if(error){
            return res.status(httpCodes.BAD_REQUEST).send(new ErrorObject(httpCodes.BAD_REQUEST,error.message));
        }

        product.__v += 1; 

        //otherwise create product Repository is invoked.
        const productObject = await productRepository.updateProduct(id,product);

        //Successful response
        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"Product updated successfully.",'/',productObject));

    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/'));
    }
});

router.delete('/deletestock/:id',async (req,res)=>{
    try {
        const {id} = req.params; 
        const product = await productRepository.deleteProduct(id);
        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"Product deleted successfully.",'/',product));
    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/'));
    }
});

router.get('/getexpiredproducts',async(req,res)=>{
    console.log(duration)

    try {
        const {category,duration}  = req.query;
        console.log(category)
        const productArray = await productRepository.getExpiredProducts(category,duration);

        if(!productArray.length){
            return res.status(httpCodes.NOT_FOUND).send(new ErrorObject(httpCodes.NOT_FOUND,"Product not found.",'/',productArray));
        }

        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"Product fetched successfully.",'/',productArray));
    
    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/'));       
    }    
})

module.exports=router;