const router =require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = require('../model_schema/user.models');

router.post("/signUp",async(req,res)=>{
    console.log(req.body.username);
    try{
        const username = req.body.username;
        const email= req.body.email;
        const phoneNumber = req.body.phoneNumber;

        if(username){
            let usernameDetails = await userSchema.findOne({'username':username}).exec()
            if(usernameDetails){
                return res.json({status:"failure",message:"username already exist"})
            }
        }else{
            return res.sendStatus(400).json({status:'failure',message:'username is must'})
        }
        if(email){
            let useremailDetails = await userSchema.findOne({"email":email}).exec()
            if(useremailDetails){
                return res.json({status:"failure",message:"email already exist"})
            }
            
        }else{
            return res.status(400).json({status:"failure",message:'email address is must'})
        }
        
        if(phoneNumber){
            let userphoneNumberDetails = await userSchema.findOne({"phoneNumber":phoneNumber}).exec()
            if(userphoneNumberDetails){
                return res.json({status:"failure",message:"phoneNumber already exist"})
            }
        }else{
            return res.status(400).json({status:"failure",message:"phoneNumber is must"})
        }

        let user = new userSchema(req.body);
        console.log('before hasing')
        console.log(user.password);
        if(req.body.password){
            let password = req.body.password;
            let salt = await bcrypt.genSalt(10);
            user.password = bcrypt.hashSync(password,salt)
            console.log("after hashing")
            console.log(user.password);
        }
        let result =await user.save();
        return res.status(200).json({status:"success",message:"user details added successfully",data:result})

    }catch (error) {
        console.log(error.message)
        return res.status(500).json({status: "failure", message: error.message})
    }
});


router.post("/accountlogin",async(req,res)=>{
    try{
        let username =req.body.username;
        let password = req.body.password;
        let userDetails;
        let details= await userSchema.findOne({username:username}).select("-password-_id").exec()
        if(username){
            userDetails = await userSchema.findOne({username:username}).exec()
            if(!userDetails){
                return res.status(400).json({status:"failure",message:"please you may signup first"}); 
            }
        }
        else{return res.status(400).json({status:"failure",message:"please enter your username"})
    }
    if(userDetails){
        let ismatch= await bcrypt.compare(password,userDetails.password)
        if(userDetails.firstLoginStatus !==true){
            await userSchema.findOneAndUpdate({uuid:userDetails.uuid},{firstLoginStatus:true},{new:true}).exec();
        }
        let payload = {uuid: userDetails.uuid} 
            if(ismatch){
                var userData = details.toObject()
                let jwttoken = jwt.sign(payload, process.env.secrectKey)
                userData.jwttoken = jwttoken
                return res.status(200).json({status: "success", message: "login successfull", data: {userData, jwttoken}})
            }else{
                return res.status(200).json({status: "failure", message: "login failed"})
            }
        }
    }catch(error){
        console.log(error.message)
        return res.status(500).json({status:"failure",message:error.message})
    }

});

router.post("/accountlogout", async(req,res)=>{
    try {
        await userSchema.findOneAndUpdate({uuid: req.params.uuid}, {new:true}).exec()
        return res.status(200).json({status: "success", message: "logout success"})
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({status: "failure", message: error.message})
    }
})



module.exports=router;
