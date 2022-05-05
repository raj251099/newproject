const mongoose = require("mongoose");
const crypto = require('crypto');

const listSchema = new mongoose.Schema({
    uuid:{type: String, required: false},
    listName: {type: String, required: true, trim: true},
    userUuid: {type: String, required: true}
},
{
    timestamps: true
});

listSchema.pre('save', function(next){
    this.uuid = 'list-'+crypto.pseudoRandomBytes(6).toString('hex').toLowerCase()
    console.log(this.uuid);
    next();
});

module.exports=mongoose.model('list',listSchema, 'list');
