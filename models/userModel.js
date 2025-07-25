


const { Schema, model } = require('mongoose')


const validator = require('validator');
// const { validate } = require('./nodeModel');
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    name: {
        type: String,
        require: [true, "please provide the name"],
        trim: true,
        minlength: [5, "Please enter the name more or greater than equal to 5 character"],
        maxlength: [20, 'please enter the name less than 20 characters'],
    },
    email: {
        type: String,
        required: [true, "please provide the email"],
        validate: validator.isEmail,
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'please provide the passowrd'],
        trim: true,
        select: false,
    },
    confirmPassword: {
        type: String,
        required: [true, "please provide the password"],
        trim: true,

        //create or save then only it work,for other not work
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'password and confirmPassword are not same'
        }
    },

    role:{
        type:String,
        enum:['user','admin'],
        default:'user',
       
    },
});

//mongoose middlewares

//doc miidleware

userSchema.pre('save', async function (next) {
    console.log(this)
    this.password = await bcrypt.hash(this.password, 12)
    this.confirmPassword = undefined;
    next();
});

userSchema.methods.correctPassword = async function (enteredPassword, hashedPassword) {
    return await bcrypt.compare(enteredPassword, hashedPassword)
}

//userSchema.post()



const User = model('user', userSchema)
module.exports = User;