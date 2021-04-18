var mongoose = require("mongoose");
//News:(image , body) -> auther : (id , username) -> comment
var newsSchema = new mongoose.Schema({
    image : String,
    body  : String,
    tag:    String,
    author: 
    {
        id:{
            type : mongoose.Schema.Types.ObjectId,
            ref  : "User" 
           }
    }, 
    comment:[{
                type: mongoose.Schema.Types.ObjectId,
                ref : "Comments"
            
            }]
})

//Send the Schema 
module.exports = mongoose.model("News",newsSchema);
