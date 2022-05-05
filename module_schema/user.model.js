const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
uuid:{type:String,required:false},
firstName:{type:String,required:true},
lastName:{type:String,required:true},
username:{type:String,required:true},
email:{type:String,required:true},
phoneNumber:{type:String,required:true},
password:{type:String,required:true},
address:{type:String,required:true}
},{
    timestamps:true
});
userSchema.pre('save',function(next){
    this.uuid = "user-"+crypto.pseudoRandomBytes(7).toString('hex').toLowerCase()
    next()
});
module.exports = mongoose.model('user',userSchema,'user');
