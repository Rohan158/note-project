const express = require('express')
const morgan = require('morgan');
const app = express();
const notesRoute = require('./routes/notesRoute')
const AppError = require("./utils/AppError");
const userRoute = require('./routes/userRoute')
const globalError = require("./middleware/globalError");


app.use((req, res, next) => {
    console.log("i am middleware 😍");
    req.requestedTime = new Date().toISOString();
    //   console.log(req.headers)
    next();
});

console.log(process.env.NODE_ENV)

if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
}


app.use(express.json())
app.use('/api/v1/notes', notesRoute)
app.use('/api/v1/users', userRoute)


//use this at the end of all routing point
app.all("{*any}", (req, res, next) => {
    //new error inbuilt error class
  next(new AppError(`path not found ${req.originalUrl} `, 400));
});

app.use(globalError)
module.exports = app