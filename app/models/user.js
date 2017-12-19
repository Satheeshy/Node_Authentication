var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    local : {
        email : String,
        Password: String
    },
    facebook : {
        id:String,
        token:String,
        name:String,
        email:String
    },
    twitter:{
        id:String,
        token:String,
        displayName:String,
        username:String
    },
    google : {
        id:String,
        token:String,
        email:String,
        name:String
    }
});

//methods 

userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
};

//check if password is valid

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password,this.local.Password);
}

module.exports = mongoose.model('User',userSchema);
