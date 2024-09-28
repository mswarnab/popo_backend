const router = require('express').Router();
const saleRepository = require('../repository/saleRepository');
const customerRepository = require('../repository/customerRepository');

router.get('/customer/:id',async(req,res)=>{
    try {
        const {id} = req.params; 
        const {page} = req.query; 
        const saleDetails = await saleRepository.getSaleBasedOnCustomerId(page,id);
        if(!saleDetail){
            return res.status(httpCodes.NOT_FOUND).send(new ErrorObject(httpCodes.NOT_FOUND,"Sale not found.",'/',saleDetails));
        }
        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"Product fetched successfully.",'/',saleDetails));
    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/'));
    }
});


router.get('/',async(req,res)=>{
    try {
        const {page,filterObject} = req.query;
        const {count, error,result} = await saleRepository.getAllSale(page,sortBy,sortValue,filterObject);

        if(!count){
            return res.status(httpCodes.NOT_FOUND).send(new ErrorObject(httpCodes.NOT_FOUND,"Sale not found.",'/',{count,result}));
        }
        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"sale details fetched successfully.",'/',{count,result}));

    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/'));       
    }
});

router.get('/:id',async(req,res)=>{
    try {
        const {id} = req.params; 
        const saleDetail = await saleRepository.getSingleSale(id);
        if(!saleDetail){
            return res.status(httpCodes.NOT_FOUND).send(new ErrorObject(httpCodes.NOT_FOUND,"Sale not found.",'/',saleDetail));
        }
        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"Product fetched successfully.",'/',saleDetail));
    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/'));
    }
});

router.post('/create', async(req,res)=>{
    try {
        const {billNumber,customerId,dateOfSale,products,totalAmount, paidAmount, cerditAmount, dueDate,__v=0} = req.body;
        const saleDetail = new Sale(billNumber,customerId,dateOfSale,products,totalAmount, paidAmount, cerditAmount, dueDate,__v=0);
        
        // Validate request body 
        const {error,value,warning} = validateReqBody(saleDetail);

        if(error){
            return res.status(httpCodes.BAD_REQUEST).send(new ErrorObject(httpCodes.BAD_REQUEST,error.message));
        }

        
        // If there is error in request body, then it will throw BAD request 
        if(customerId != "dummy"){
            const customerSideValidation = await customerRepository.getSingleCustomer(customerId)

            if(!customerSideValidation){
                return res.status(httpCodes.BAD_REQUEST).send(new ErrorObject(httpCodes.BAD_REQUEST,"Customer Id is not valid."));
            }
        }

        //otherwise create product Repository is invoked.
        const saleDetailObject = await saleRepository.createSale(saleDetail);

        // Successful response 
        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"Sale detail added successfully.",'/',saleDetailObject));

    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/'));
    }
});

router.put('/update/:id',async(req,res)=>{
    try {
        const {billNumber,customerId,dateOfSale,products,totalAmount, paidAmount, cerditAmount, dueDate,__v=0} = req.body;
        const saleDetail = new Sale(billNumber,customerId,dateOfSale,products,totalAmount, paidAmount, cerditAmount, dueDate,__v=0);
        
        // Validate request body 
        const {error,value,warning} = validateReqBody(saleDetail);
        
        // If there is error in request body, then it will throw BAD request 
        if(error){
            return res.status(httpCodes.BAD_REQUEST).send(new ErrorObject(httpCodes.BAD_REQUEST,error.message));
        }

        if(customerId != "dummy"){
            const customerSideValidation = await customerRepository.getSingleCustomer(customerId)

            if(!customerSideValidation){
                return res.status(httpCodes.BAD_REQUEST).send(new ErrorObject(httpCodes.BAD_REQUEST,"Customer Id is not valid."));
            }
        }

        saleDetail.__v += 1; 

        //otherwise create product Repository is invoked.
        const saleDetailObject = await saleRepository.updateSale(saleDetail);

        // Successful response 
        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"Sale detail added successfully.",'/',saleDetailObject));

    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/'));
    }
});

router.delete('/delete/:id',async(req,res)=>{
    try {
        const {id} = req.params; 
        const saleDetail = await saleRepository.deleteSale(id);
        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"SaleDetails deleted successfully.",'/',saleDetail));
    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/'));
    }
});

module.exports = router;