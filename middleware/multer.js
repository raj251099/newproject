const multer = require('multer');

const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, './uploadFiles/')
    },
    filename: (req, file, cb)=>{
        console.log(file.originalname);
        cb(null, `${file.originalname}`);
    }
})

module.exports = {storage: storage};
