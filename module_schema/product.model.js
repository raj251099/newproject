const mongoose = require("mongoose");
const crypto =require("crypto");

const productSchema =new mongoose.Schema({
    uuid:{type:String,required:false},
    productName:{type:String,required:true,trim:true},
    description:{type:String,required:true,trim:true},
    price:{type:Number,required:true,trim:true},
    userUuid:{type:String,requird:true,trim:true},
    listUuid:{type:String,required:true,trim:true}
},
{
    timestamps:true
})

productSchema.pre('save',function(next){
    this.uuid= "prod_"+crypto.pseudoRandomBytes(7).toString("hex").toLowerCase()
    console.log(this.uuid);
    next();
});
module.exports=mongoose.model('product',productSchema,'product');
