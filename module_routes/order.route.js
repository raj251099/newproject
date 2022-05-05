const router = require('express').Router();
const orderSchema = require("../model_schema/order.models");

router.post('/add_cart',async(req,res)=>{
    const{productName,productUuid,price,quantity}=req.body;
   // const total = req.body.total;
    const userUuid =req.query.userUuid;
    console.log(userUuid);
    let prodDetails =req.body.prodDetails;
    
    try {
        const newOrder = new orderSchema(req.body);
        console.log(newOrder);
        let order = await orderSchema.findOne({userUuid});
        if(order){
            let product = order.prodDetails.findIndex(p=> p.productUuid == productUuid);
            console.log(product);
            if(product > -1){
                let productQty = order.prodDetails[product];
                console.log(productQty);
                productQty.quantity  = quantity;
                order.prodDetails[product]=productQty;

                productQty.price=price*productQty.quantity ;
                console.log( productQty.price);

                // let total1 =  productQty.price;
                // let totalPrice= prodDetails.price;
                // if(totalPrice.length >=1){
                //    productQty.price += prodDetails.price ;
                //   console.log(subtotal);
                // }else{
                //     order.prodDetails.push({total});   
                // }

                // let total =  productQty.price;
                // console.log(total)

                // productQty.price +=productQty.price;
                // console.log(productQty.price);
            }
            else{
                order.prodDetails.push({productName,productUuid,quantity,price});
            }
            order = await order.save();
            return res.status(200).send(order);
        } 
        else{
          const newCart = await orderSchema.create({userUuid,
              prodDetails:[{productName,productUuid,quantity,price}]
          });
          return res.status(200).json({"message":"successfulley new cart created","result":newCart});
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json(error);
        
    }
});


module.exports = router;
