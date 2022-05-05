const mongoose = require('mongoose');
const crypto = require('crypto');
const { number } = require('joi');

const orderSchema = new mongoose.Schema({
    uuid: {type: String, required:false},
    userUuid:{type:String,ref: "user"},
    prodDetails:[
    {
        productName:{type:String},
        productUuid:{type:String},
        quantity:{type:Number},
        price:{type:Number}
        
       },
    ],
    //total:{type:Number,required:true}
    
},
{
    timestamps: true
});

orderSchema.pre('save', function(next){
    this.uuid = 'ord-'+crypto.pseudoRandomBytes(7).toString('hex').toLowerCase()
    console.log(this.uuid);
    next();
});

module.exports=mongoose.model('order',orderSchema,'order');
