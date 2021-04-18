var express = require("express"),
    passport   = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    app = express();
const mongoose   = require("mongoose");
   

//MODELS OF Schema//
var Users = require("./models/user");
var PostOfProfile = require("./models/news");
const { findById } = require("./models/user");
//END



//SET AND USE//
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended:true}));
app.use(require("express-session")({
	secret:"Hello it's me Nir Vaknin from israel",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());
app.use(express.static(__dirname + "/public"));
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();

})
mongoose.set('useFindAndModify', false);

//END



//CONNECT TO DATABASE//
mongoose.connect('mongodb://localhost:27017/blogDB', {useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("CONNECTED TO DB");
});
//END




//**--ROUTES PAGES--**//

//**Home Page**//
app.get("/",function(req,res)
{
    PostOfProfile.find({},function(err,PostOfProfiles){
        if(err){
            console.log(err);
        }
        else{
            
            res.render("home",{"PostOfProfiles":PostOfProfiles});
        }
    })
});
//**END**//


//**Profile Page**//
app.get("/profile/:id",ifLogin,function(req,res){
    //i want to see profile of user and all post of user
    Users.findById(req.params.id,function(err,user){
        if(err)
        {
            console.log(err);
        }
        else
        {
           
            PostOfProfile.find({"author.id":mongoose.Types.ObjectId(req.params.id)},function(err,posts)
             {
                //send all user info to next page (POST & USER)
                console.log(posts);
                res.render("user/profile",{"connectOfUser":user,"posts":posts}); 
            })
             
        }
    });

});

app.post("/profile/:id",function(req,res){
    PostOfProfile.create({
        image: req.body.image,
        body : req.body.text,
        tag  : req.body.tag,
        author: 
        {
            id:req.user.id,
        }
    
    },function(err,newCreate){
        if(err)
        {
            console.log(err);
        }
        else{
            res.redirect("/")
         }
    });
    
});

app.get("/profile/:id/edit",function(req,res){
    
    res.render("user/edit/edituser")

})

app.post("/profile/:id/edit",function(req,res)
{
    
    if(req.body.password == req.body.passwordconf)
    {
        Users.findById({ _id : req.params.id } , function(err,user){

            user.setPassword(req.body.password,function(err,user){
                
                if(err)
                {
                    console(err);
                }
                else
                {
                    Users.save();
                    res.redirect("/login");
                }

            })
        })
    }
    
});

//END//


//**Register**//
app.get("/register",function(req,res){

    res.render("user/register");

})


//TODO:Validation
app.post("/register",function(req,res){
var newUser = new Users({username:req.body.username,
                        fullname:req.body.fullname,
                        birthday:req.body.birthday});

        Users.register(newUser , req.body.password , function(err,user){
            if(err)
            {
                console.log(err);
                return res.render("register");
            }
            passport.authenticate("local")(req, res, function()
            {
                res.redirect("/login");
            });

        });

}); 
//**END**//



//**Login**//
app.get("/login" , function(req,res){
        res.render("user/login")
});


//If I connect to the site you will take me to the home page and if you do not send me again to connect
app.post("/login",passport.authenticate("local",{
	successRedirect:"/",
	failureRedirect:"/login"
}));

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
})

//**END**//

//POST SHOW//
app.get("/profile/:id/:post",function(req,res)
{
    PostOfProfile.findById({ _id:req.params.post },function(err,thisPost)
    {
         res.render("postfolder/post",{"thisPost":thisPost});
    })
})
//END

//EDIT POST
app.get("/profile/:id/:post/edit",function(req,res){
    PostOfProfile.findById({ _id:req.params.post },function(err,thisPost)
    {
         res.render("postfolder/edit/editpost",{"thisPost":thisPost});
    })
})

app.post("/profile/:id/:post/edit",function(req,res){
    //PostOfProfile.findByIdAndUpdate(id,params,callback);
        PostOfProfile.findByIdAndUpdate(req.params.post,{ image:req.body.image , body:req.body.text , tag:req.body.tag},
        function(err,updatePost)
        {
            if(err)
            {   
                res.redirect("back")
            }
            else
            {
                
                res.redirect("/profile/"+req.params.id+"/"+req.params.post)
            }

    })
})

//END


//*Func*//
function ifLogin(req,res,next){
    if(req.isAuthenticated){
        return next();
    }
    res.redirect("/login")
}
//*End*//



//Default page//


//END


//CONNECT TO SERVER//
app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
//END



//TODO//
//change schema profile -> news
//profile click -> Send id to profile page 
