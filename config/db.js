const mongoose= require('mongoose')

const url=process.env.MONGODB_URL;

const connectDB=async (req,res)=>{
    await mongoose.connect(url);
    console.log('db is connected')
}

module.exports=connectDB;