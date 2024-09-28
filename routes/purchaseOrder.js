const router = require('express').Router();
const purchaseOrderRepository = require('../repository/purchaseOrderRepository');
const PurchaseOrder = require('../static/classes/purchaseOrder');
const validateReqBody = require('../static/validation/validatePurchaseOrder');

router.get('/',async (req,res)=>{
    try {
        const {count, error, result}= purchaseOrderRepository.getAllPurchaseOrder();
        if(!count){
            return res.status(httpCodes.NOT_FOUND).send(new ErrorObject(httpCodes.NOT_FOUND,"Purchase order not found.",'/',{count,result}));
        }

        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"Purchase order fetched successfully.",'/',{count,result}));
    
    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/')); 
    }
});

router.get('/:id',async (req,res)=>{
    try {
        const {id} = req.params; 
        const {count,error,result} = await purchaseOrderRepository.getSinglePurchaseOrder(id);
        if(!count){
            return res.status(httpCodes.NOT_FOUND).send(new ErrorObject(httpCodes.NOT_FOUND,"Purchase order not found.",'/',result));
        }
        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"Purchase order fetched successfully.",'/',result));
    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/'));
    }
});

router.post('/addpurchaseorder',async (req,res)=>{
    try {
        const {
            orderNumber,
            supplierId,
            dateOfPruchase,
            products,
            totalAmount,
            paidAmount,
            cerditAmount,
            dueDate,
            __v} = req.body;

            
        const purchaseOrder = new PurchaseOrder(
            orderNumber,
            supplierId,
            dateOfPruchase,
            products,
            totalAmount,
            paidAmount,
            cerditAmount,
            dueDate,
            __v 
        );
        

        // Validate request body 
        const {error,value,warning} = validateReqBody(purchaseOrder);
        
        // If there is error in request body, then it will throw BAD request 
        if(error){
            return res.status(httpCodes.BAD_REQUEST).send(new ErrorObject(httpCodes.BAD_REQUEST,error.message));
        }

        //otherwise purchase order Repository is invoked.
        const purchaseOrderObject = await purchaseOrderRepository.createPurchaseOrder(purchaseOrder);

        
        // If there is error in request body, then it will throw BAD request 
        if(error){
            return res.status(httpCodes.BAD_REQUEST).send(new ErrorObject(httpCodes.BAD_REQUEST,error.message));
        }

        // Successful response 
        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"Purchase order added successfully.",'/',purchaseOrderObject));

    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/'));
    }
});

router.update('/updatepurchaseorder/:id',async (req,res)=>{
    try {
        const {id} = req.params;
        const {
            orderNumber,
            supplierId,
            dateOfPruchase,
            products,
            totalAmount,
            paidAmount,
            cerditAmount,
            dueDate,
            __v} = req.body;

        const purchaseOrder = new PurchaseOrder(
            orderNumber,
            supplierId,
            dateOfPruchase,
            products,
            totalAmount,
            paidAmount,
            cerditAmount,
            dueDate,
            __v 
        );
        
        // Validate request body 
        const {error,value,warning} = validateReqBody(purchaseOrder);
        
        // If there is error in request body, then it will throw BAD request 
        if(error){
            return res.status(httpCodes.BAD_REQUEST).send(new ErrorObject(httpCodes.BAD_REQUEST,error.message));
        }

        purchaseOrder.__v += 1; 

        //otherwise purchase order Repository is invoked.
        const purchaseOrderObjectObject = await purchaseOrderRepository.updatePurchaseOrder(id,purchaseOrder);

        //Successful response
        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"Purchase order updated successfully.",'/',purchaseOrderObjectObject));

    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/'));
    }
});

router.delete('/deletepurchaseorder/:id',async (req,res)=>{
    try {
        const {id} = req.params; 
        const purchaseOrder = await purchaseOrderRepository.deletePurchaseOrder(id);
        return res.status(httpCodes.OK).send(new ResponseObject(httpCodes.OK,"Purchase order deleted successfully.",'/',purchaseOrder));
    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).send(new ErrorObject(httpCodes.INTERNAL_SERVER_ERROR,error.message,'/'));
    }
});

module.exports=router;