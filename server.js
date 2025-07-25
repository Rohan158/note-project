const dotenv=require('dotenv');
dotenv.config({quiet:true})

const app=require('./app')
const connectDB=require('./config/db')

connectDB()

const port=process.env.PORT
app.listen(port,(err)=>{
    if (err) throw err;
    console.log('server running on http://localhost:5000')
})