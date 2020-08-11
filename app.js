var express=require('express'),
 	app=express(),
 	bodyParser = require("body-parser"),
	mongoose=require("mongoose"),
	flash = require("connect-flash"),
	Campground=require("./models/campground"),
	Comment=require("./models/comment"),
	passport=require("passport"),
	LocalStrategy=require("passport-local"),
	methodOverride=require("method-override"),
	User=require("./models/user"),
	SeedDB=require("./seeds");

var commentRoutes=require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	authRoutes=require("./routes/auth");


//SeedDB();
mongoose.connect("mongodb://localhost:27017/yelp_camp_main", {useNewUrlParser: true, useUnifiedTopology: true});



/*Campground.create(
	{
		name:"Dahramshala", 
		image: "https://img.traveltriangle.com/blog/wp-content/uploads/2019/11/CAMPING-IN-DHARAMSHALA-29_nov.jpg",
		description: "This is beautiful hill station situated in the himalayas. Usually very popular for its monastries"
	},
	function(err, campground){
		if(err){console.log(err);
			   }
		else{
			console.log("successfully added to database");
			console.log(campground);
		}
	});*/
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "NOthing beats me",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser=req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use(authRoutes);



app.listen(process.env.PORT || 3000, process.env.IP, function(req, res){
	console.log("server is listening");
});