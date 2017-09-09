const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
//Bring in article model
let User = require('../models/users');


router.get('/register',function (req,res) {
   res.render('register',{
       title : "Register"
   });
});

router.post('/register',function (req,res) {
    let name = req.body.name;
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let password2 = req.body.password2;

    req.checkBody('name','Name is required').notEmpty();
    req.checkBody('email','Email is required').notEmpty();
    req.checkBody('email','Email is not valid').isEmail();
    req.checkBody('username','Username should be filled').notEmpty();
    req.checkBody('password','password is required').notEmpty();
    req.checkBody('password2','passwords do not match').equals(req.body.password);

    let errors = req.validationErrors();

    if(errors){
        errors.forEach(function (e) {
            req.flash('danger',e.msg);
        });
        res.render('register',{
            title : "Register"
        });
        console.log("Errors");
    }
    else {
        let newUser = User({
            name:name,
            email:email,
            username:username,
            password:password
        });

        bcrypt.genSalt(10,function (err,salt) {
            bcrypt.hash(newUser.password,salt,function (err,hash) {
               if(err){
                   console.log(err);
               }else{
                   newUser.password = hash;
                   newUser.save(function (err) {
                       if(err){
                           console.log(err);
                       }else{
                           req.flash('success','You have successfully registered and can now log in');
                           res.redirect('/users/login');
                       }
                   });
               }
            });
        });
    }

});
//Login form
router.get('/login',function (req,res) {
   res.render('login',{
       title:"Login"
   });
});


//Login process
router.post('/login', function(req, res, next){

    passport.authenticate('local',{
        successRedirect:'/',
        failureRedirect:'/users/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', function (req,res) {
    req.logout();
    req.flash('success','You are logged out!');
    res.redirect('/users/login');
})

module.exports = router;