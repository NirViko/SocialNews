var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

//Schema for user//

var UserSchema = new mongoose.Schema({
    username : String,
    fullname : String,
    birthday : Date,
    password : String

});
UserSchema.plugin(passportLocalMongoose);

//Send the Schema 
module.exports = mongoose.model("User",UserSchema);