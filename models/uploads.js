const mongoose=require('mongoose');
const uploadSchema= mongoose.Schema({
    name:String,
    password:String

});

module.exports=mongoose.model('uploads',uploadSchema);

