const {Schema,model}=require('mongoose');
const { title } = require('process');

const noteSchema=new Schema({
    title:{
    type:String,
    required:[true,"Please provide the title"],
    trim:true,
},

content:{
    type:String,
    required:[true,"Please provide the title"],
    trim:true,
},

describe:{
    type:String,
    required:[true,"please provide the describe"],
    trim:true,
}

})

const Note=model('notes',noteSchema);

module.exports=Note