const router = require('express').Router();
const req = require('express/lib/request');
const listSchema = require("../model_schema/list.model")


router.post('/addlist', async(req,res)=>{
    try{
        const data = new listSchema(req.body);
        const result = await data.save()
        return res.status(200).json({status: "success", message: 'category added successfully', result: result})
    }catch(error){
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})
    }
});  


router.get("/showAllList",async(req,res)=>{
    try {
       const listDetail = await listSchema.find().exec()
       if(listDetail.length>0){
           return res.status(200).json({"status":"success",message:"successfully get all list","result":listDetail});
       } 
       else{
           return res.status(404).json({"status":"failure","message": error.message})
       }
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({"status":"failure","message":error.message})
    }
});


router.get("/showParticularList", async(req,res)=>{
    try {
        const listDetail = await listSchema.findOne({"uuid" : req.query.list_uuid}).exec();
        if(listDetail){
            return res.status(200).json({'status': 'success', message: "list details fetched successfully", 'result': listDetail});
        }
        else{
            return res.status(404).json({'status': 'failure', message: "No list details available"})
        }
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})
    }
});

router.get("/listBasedProduct", async(req,res)=>{
    try {
        let list  = req.query.list_uuid;
        let prodDetail = await listSchema.aggregate([
            { $match:{
                uuid: {$eq:list}
            }
        },
            {
                '$lookup':{
                    from:'product',
                    localField: 'uuid',
                    foreignField: 'listUuid',
                    as: 'product_details'
                }
            }
        ])

        
        if(prodDetail.length > 0){
            return res.status(200).json({'status': 'success', message: "Product details fetched successfully", 'result': prodDetail});
        }else{
            return res.status(404).json({'status': 'failure', message: "No Product details available"})
        }
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})
    }
});






module.exports = router;
