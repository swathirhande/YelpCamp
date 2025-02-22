const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email:{
        type:String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose);
//This is going to add on username and password to our UserSchema 

module.exports = mongoose.model('User',UserSchema);