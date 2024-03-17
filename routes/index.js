var express = require('express');
var router = express.Router();
const userModel = require("./users");
const passport = require('passport');

const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/profile', isloggedIn , function(req, res, next) {
  res.render('profile' , { username: req.user.username });
});
// dashboard route
router.get("/dashboard", function(req ,res){
  res.render("dashboard");
});
router.post("/register", function(req,res){

  var userdata = new userModel({
    username: req.body.username,
    secret: req.body.secret
  });
userModel.register(userdata , req.body.password)
.then(function (registerduser){
  passport.authenticate("local")(req ,res ,function(){
    res.redirect("/profile");
  })
})

});

router.post("/login", passport.authenticate("local", {
  successRedirect:"/profile",
  failureRedirect:"/"
})),function(req,res){}

// router.post("/login", passport.authenticate("local", {
//   successRedirect: "/profile",
//   failureRedirect: "/"
// }), function(req, res) {
//    This callback function is not needed, remove it.
// });


router.get("/logout", function(req,res,next){
req.logout(function(err){
  if(err){return next(err);}
  res.redirect("/");
});
});

function isloggedIn(req , res ,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
}
module.exports = router;
