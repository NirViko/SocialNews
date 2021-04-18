var mongoose = require("mongoose");
//Comment -> auther : id , username
var commentSchema= new mongoose.Schema({
    comment : String,
    author :{
        id:{
            id : mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username:String
    }


})