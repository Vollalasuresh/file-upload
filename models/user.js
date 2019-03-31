const mongoose=require('mongoose');
const bcrypt=require('bcrypt-nodejs');
const userSchema= mongoose.Schema({
    name:String,
    password:String,
    username:{
        type:String,
        unique:true
    },
    phoneno:Number

});
userSchema.methods.encryptPassword=(password)=>
{
    console.log(password)
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10),null)

}
userSchema.methods.validPassword=(password,user)=>
{
    return bcrypt.compareSync(password,user.password);

}

module.exports=mongoose.model('user',userSchema);

