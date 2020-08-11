//Campground Routes
var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var middleware = require("../middleware");

router.get("/", function(req, res){
	//get data fromdatabase
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/campgrounds",{campgrounds: allCampgrounds});
		}
	})
	
});



router.get("/new", middleware.isLoggedIn,function(req, res){
	res.render("campgrounds/new");
})


//Shows particular campground
router.get("/:id", function(req, res){
	//find campgroundmwith given id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err)
		}
		else{
			res.render("campgrounds/show",{campground: foundCampground});
		}
	})
	
})

router.post("/", middleware.isLoggedIn,function(req, res){
	//get data from form and add to array
	var name=req.body.name;
	var price=req.body.price;
	var image=req.body.image;
	var desc=req.body.description;
	var author= {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground={name: name, price: price,image: image, description: desc, author: author};
	Campground.create(newCampground, function(err, campground){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/campgrounds");
		}
	});
	//redirect to campgrounds
});

//Edit campgrounds
router.get("/:id/edit", middleware.checkOwnership,function(req, res){
	
	//check if user is loggedIn
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	})
		
});
//Update campground
router.put("/:id", middleware.checkOwnership,function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

//Delete campground
router.delete("/:id", middleware.checkOwnership,function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds");
		}
	})
})




/*function checkOwnership(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			res.redirect("back");
		}
		else{
			//then check if user owns the campground
			if(foundCampground.author.id.equals(req.user._id)){
				next();
			}
			else{
				res.redirect("back");
			}
			
		}
	});
	}
	else{
		res.redirect("back");
	}
}*/


module.exports=router;