const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
require('dotenv').config()
const port = process.env.PORT||8080;
   
const userRouter = require('./model_routes/user.routes');
const productRouter = require('./model_routes/product.routes');
const listRouter = require('./model_routes/list.route');
const orderRouter = require('./model_routes/order.routes');
const app = express();
app.use(cors());

app.get("/healthcheck", async(req,res)=>{
    console.log("working");
    res.send({status:"success"})
})
mongoose.connect(process.env.dbUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(data=>{
    console.log("successfully db is connected")
}).catch(err=>{
    console.log(err.message)
    process.exit(1)
})
app.use(express.json());
app.use('/api/v1/users/', userRouter);
app.use('/api/v2/product/', productRouter);
app.use('/api/v3/list/', listRouter);
app.use('/api/v4/order/', orderRouter);
app.listen(port,()=>{
    console.log("srerver starting at..8070 port")
    console.log(`http://127.0.0.1:${port}`)
});

