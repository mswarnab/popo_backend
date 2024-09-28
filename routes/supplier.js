const router = require('express').Router();
const supplierRepository = require('../repository/supplierRepository');
const Supplier = require('../static/classes/supplier');
const validateReqBody = require('../static/validation/validateSupplier');

router.get('/search', async(req,res)=>{
    try {
        const {pattern}  = req.query;
        const {count,error ,result} = await supplierRepository.getSearchResult(pattern);

        if(!count){
            return res.status(httpCodes.NOT_FOUND).send(new ErrorObject(httpCodes.NOT_FOUND,"supplier not found.",'/',{count,result}));
        }

        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"supplier fetched successfully.",'/',{count,result}));
    
    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/'));       
    }    
})

router.get('/findsupplierwithname', async(req,res)=>{
    try {
        const {pattern}  = req.query;
        const {count,error ,result} = await supplierRepository.getsuppliersOnRegex(pattern);

        if(!count){
            return res.status(httpCodes.NOT_FOUND).send(new ErrorObject(httpCodes.NOT_FOUND,"supplier not found.",'/',{count,result}));
        }

        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"supplier fetched successfully.",'/',{count,result}));
    
    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/'));       
    }      
})

router.get('/creditamount', async(req,res)=>{
    try {
        const {count,error ,result} = await supplierRepository.getsuppliersHavingCredit();

        if(!count){
            return res.status(httpCodes.NOT_FOUND).send(new ErrorObject(httpCodes.NOT_FOUND,"supplier not found.",'/',{count,result}));
        }

        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"supplier fetched successfully.",'/',{count,result}));
    
    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/'));       
    }      
})



router.get('/',async (req,res)=>{
    try {
        const {count, error, result}= supplierRepository.getAllsupplier();
        if(!count){
            return res.status(httpCodes.NOT_FOUND).send(new ErrorObject(httpCodes.NOT_FOUND,"supplier not found.",'/',{count,result}));
        }

        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"supplier fetched successfully.",'/',{count,result}));
    
    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/')); 
    }
});

router.get('/:id',async (req,res)=>{
    try {
        const {id} = req.params; 
        const {count,error,result} = await supplierRepository.getSinglesupplier(id);
        if(!count){
            return res.status(httpCodes.NOT_FOUND).send(new ErrorObject(httpCodes.NOT_FOUND,"Purchase order not found.",'/',result));
        }
        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"supplier fetched successfully.",'/',result));
    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/'));
    }
});

router.post('/addsupplier',async (req,res)=>{
    try {
        const {
            supplierName,
            supplierContactNo,
            supplierAddress,
            lastPurchaseDate,
            totalCreditAmount,
            __v} = req.body;

            
        const supplier = new Supplier(
            supplierName,
            supplierContactNo,
            supplierAddress,
            lastPurchaseDate,
            totalCreditAmount,
            __v 
        );
        

        // Validate request body 
        const {error,value,warning} = validateReqBody(supplier);
        
        // If there is error in request body, then it will throw BAD request 
        if(error){
            return res.status(httpCodes.BAD_REQUEST).send(new ErrorObject(httpCodes.BAD_REQUEST,error.message));
        }

        //otherwise purchase order Repository is invoked.
        const supplierObject = await supplierRepository.createsupplier(supplier);

        
        // If there is error in request body, then it will throw BAD request 
        if(error){
            return res.status(httpCodes.BAD_REQUEST).send(new ErrorObject(httpCodes.BAD_REQUEST,error.message));
        }

        // Successful response 
        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"supplier added successfully.",'/',supplierObject));

    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/'));
    }
});

router.put('/updatesupplier/:id',async (req,res)=>{
    try {
        const {id} = req.params;
        const {
            supplierName,
            supplierContactNo,
            supplierAddress,
            lastPurchaseDate,
            totalCreditAmount,
            __v} = req.body;

            
        const supplier = new Supplier(
            supplierName,
            supplierContactNo,
            supplierAddress,
            lastPurchaseDate,
            totalCreditAmount,
            __v 
        );
        
        
        // Validate request body 
        const {error,value,warning} = validateReqBody(supplier);
        
        // If there is error in request body, then it will throw BAD request 
        if(error){
            return res.status(httpCodes.BAD_REQUEST).send(new ErrorObject(httpCodes.BAD_REQUEST,error.message));
        }

        supplier.__v += 1; 

        //otherwise purchase order Repository is invoked.
        const supplierObject = await supplierRepository.updatesupplier(id,supplier);

        //Successful response
        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"supplier updated successfully.",'/',supplierObject));

    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/'));
    }
});

router.delete('/deletesupplier/:id',async (req,res)=>{
    try {
        const {id} = req.params; 
        const supplier = await supplierRepository.deletesupplier(id);
        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"supplier deleted successfully.",'/',supplier));
    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/'));
    }
});

module.exports=router;