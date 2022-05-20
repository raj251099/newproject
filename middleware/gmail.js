const nodemailer = require('nodemailer');
const ejs = require('ejs');
const {join} = require('path');

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: "esakkiraj.platosys@gmail.com",
        pass: "Oct251099"
    },
});

async function mailSending (mailData){
    try {
        console.log(mailData.attachments)
        const data = await ejs.renderFile(join(__dirname,'../templates/', mailData.fileName), mailData, mailData.details)
        const mailDetails = {
            from:mailData.from,
            to:mailData.to,
            subject:mailData.subject,
            html:data
        }
        transporter.sendMail(mailDetails, (err, data)=>{
            if(err){
                console.log("err", err.message)
            }else{
                console.log("Mail sent successfully");
                return 1
            }
        })    
    } catch (error) {
        console.log(error.message)
        process.exit(1);
    }
}

module.exports = { mailSending: mailSending}
