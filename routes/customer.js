const router = require('express').Router();
const customerRepository = require('../repository/customerRepository');
const Customer = require('../static/classes/customer');
const validateReqBody = require('../static/validation/validateCustomer');

router.get('/search', async(req,res)=>{
    try {
        const {pattern}  = req.query;
        const {count,error ,result} = await customerRepository.getSearchResult(pattern);

        if(!count){
            return res.status(httpCodes.NOT_FOUND).send(new ErrorObject(httpCodes.NOT_FOUND,"Customer not found.",'/',{count,result}));
        }

        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"Customer fetched successfully.",'/',{count,result}));
    
    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/'));       
    }    
})

router.get('/findcustomerwithname', async(req,res)=>{
    try {
        const {pattern}  = req.query;
        const {count,error ,result} = await customerRepository.getCustomersOnRegex(pattern);

        if(!count){
            return res.status(httpCodes.NOT_FOUND).send(new ErrorObject(httpCodes.NOT_FOUND,"Customer not found.",'/',{count,result}));
        }

        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"Customer fetched successfully.",'/',{count,result}));
    
    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/'));       
    }      
})

router.get('/creditamount', async(req,res)=>{
    try {
        const {count,error ,result} = await customerRepository.getCustomersHavingCredit();

        if(!count){
            return res.status(httpCodes.NOT_FOUND).send(new ErrorObject(httpCodes.NOT_FOUND,"Customer not found.",'/',{count,result}));
        }

        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"Customer fetched successfully.",'/',{count,result}));
    
    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/'));       
    }      
})



router.get('/',async (req,res)=>{
    try {
        const {count, error, result}= customerRepository.getAllCustomer();
        if(!count){
            return res.status(httpCodes.NOT_FOUND).send(new ErrorObject(httpCodes.NOT_FOUND,"Customer not found.",'/',{count,result}));
        }

        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"Customer fetched successfully.",'/',{count,result}));
    
    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/')); 
    }
});

router.get('/:id',async (req,res)=>{
    try {
        const {id} = req.params; 
        const {count,error,result} = await customerRepository.getSingleCustomer(id);
        if(!count){
            return res.status(httpCodes.NOT_FOUND).send(new ErrorObject(httpCodes.NOT_FOUND,"Purchase order not found.",'/',result));
        }
        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"Customer fetched successfully.",'/',result));
    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/'));
    }
});

router.post('/addcustomer',async (req,res)=>{
    try {
        const {
            customerName,
            customerContactNo,
            customerAddress,
            lastPurchaseDate,
            totalCreditAmount,
            __v} = req.body;

            
        const customer = new Customer(
            customerName,
            customerContactNo,
            customerAddress,
            lastPurchaseDate,
            totalCreditAmount,
            __v 
        );
        

        // Validate request body 
        const {error,value,warning} = validateReqBody(customer);
        
        // If there is error in request body, then it will throw BAD request 
        if(error){
            return res.status(httpCodes.BAD_REQUEST).send(new ErrorObject(httpCodes.BAD_REQUEST,error.message));
        }

        //otherwise purchase order Repository is invoked.
        const customerObject = await customerRepository.createCustomer(customer);

        
        // If there is error in request body, then it will throw BAD request 
        if(error){
            return res.status(httpCodes.BAD_REQUEST).send(new ErrorObject(httpCodes.BAD_REQUEST,error.message));
        }

        // Successful response 
        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"Customer created successfully.",'/',customerObject));

    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/'));
    }
});

router.put('/updatecustomer/:id',async (req,res)=>{
    try {
        const {id} = req.params;
        const {
            customerName,
            customerContactNo,
            customerAddress,
            lastPurchaseDate,
            totalCreditAmount,
            __v} = req.body;

            
        const customer = new Customer(
            customerName,
            customerContactNo,
            customerAddress,
            lastPurchaseDate,
            totalCreditAmount,
            __v 
        );
        
        
        // Validate request body 
        const {error,value,warning} = validateReqBody(customer);
        
        // If there is error in request body, then it will throw BAD request 
        if(error){
            return res.status(httpCodes.BAD_REQUEST).send(new ErrorObject(httpCodes.BAD_REQUEST,error.message));
        }

        customer.__v += 1; 

        //otherwise purchase order Repository is invoked.
        const customerObject = await customerRepository.updateCustomer(id,customer);

        if(!customerObject){
            return res.status(httpCodes.BAD_REQUEST).send(new ErrorObject(httpCodes.BAD_REQUEST,'Something went wrong'));
        }

        //Successful response
        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"Customer updated successfully.",'/',customerObject));

    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/'));
    }
});

router.delete('/deletecustomer/:id',async (req,res)=>{
    try {
        const {id} = req.params; 
        const customer = await customerRepository.deleteCustomer(id);
        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"Customer deleted successfully.",'/',customer));
    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/'));
    }
});

module.exports=router;