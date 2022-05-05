const router = require('express').Router();
const productSchema = require("../model_schema/product.models");



router.post('/addNewProduct', async(req,res)=>{
    try{
        let prodDetail = req.body
        const data = new productSchema(prodDetail);
        const result = await data.save();
        return res.status(200).json({'status': 'success', "message": "Product details added successfully", "result": result})
    }catch(error){
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})
    }
});

router.get("/allProducts",async(req,res)=>{
    try {
       const prodDetail = await productSchema.find().exec()
       if(prodDetail.length>0){
           return res.status(200).json({"status":"success",message:"successfully get all products","result":prodDetail});
       } 
       else{
           return res.status(404).json({"status":"failure","message": error.message})
       }
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({"status":"failure","message":error.message})
    }
});

router.get("/showParticularProd", async(req,res)=>{
    try {
        const prodDetail = await productSchema.findOne({"uuid" : req.query.product_uuid}).exec();
        if(prodDetail){
            return res.status(200).json({'status': 'success', message: "Product details fetched successfully", 'result': prodDetail});
        }
        else{
            return res.status(404).json({'status': 'failure', message: "No Product details available"})
        }
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})
    }
});

router.get('/priceFilter',async(req,res)=>{
    try{
        let minPrice = req.query.minPrice;
        let maxPrice = req.query.maxPrice;
        const prodDetail = await productSchema.aggregate([    
        {
            $match:{
                $and:[
                     
                     { price: {
                        $gte: parseInt (minPrice),
                        $lte:parseInt (maxPrice),
                     }, 
                     },
                ],
            },
        },
    
        {
            $sort:{price:1}
        }, {
            $project:{
                "_id":0,
                "userUuid":0,
                "listUuid":0,
                "createdAt":0,
                "updatedAt":0,
                "uuid":0
                
            }
        } 
        ])
        if(prodDetail){
          return  res.json({status:'success',message:'successfully rate filtered','result':prodDetail});
        }else{
          return  res.json({status:'failure',message:err.message});
        }
    }catch(err){
        return res.json({'error':err.message})
    }
})


router.get("/search_product",async(req,res)=>{
    try {
      let search = {};
         // console.log("true",search)
          search.productName = {
              $regex:req.query.productName,
              $options:'i',
          }
    // console.log(search);
      let result = await productSchema.find(search).exec();
      return res.status(200).json({"message":"successfully its worked",'result':result})

    } catch (error) {
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message}) 
    }
})


module.exports=router;
