const express = require("express");
const router = express.Router();
const passport = require('passport');
var User = require('../models/user');
var up= require('../models/uploads')

const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage')

//I used an mlab Sandbox DB. Substitute the details with your own
const url = process.env.DBURI

let storage = new GridFsStorage({
  url: url,
  file: (req, file) => {
    return {
      bucketName: 'upload',       //Setting collection name, default name is fs
      filename: file.originalname     //Setting file name to original name of file
    }
  }
});
console.log("from storage",storage)
let upload = null;

storage.on('connection', (db) => {
  //Setting up upload for a single file
  
});
upload = multer({
    storage: storage
  });
  
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

router.get('/signup', (req, res) => {
    usererr_msg = req.flash('userExist');
    res.render('signup', { usererr_msg });
})

router.get('/login', (req, res) => {
    login_err = req.flash('loginError');
    password_err = req.flash('passwordError');
    res.render('login', { login_err, password_err });
})

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/show',
    failureRedirect: '/signup',
    failureFlash: true,
}))

router.post('/login', passport.authenticate('local.login', {
    successRedirect: '/show',
    failureRedirect: '/login',
    failureFlash: true,
}))

router.get('/show', isLoggedIn, (req, res) => {
   
    res.render('show', { u:req.user });

})

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/')
})

router.get('/editprofile',isLoggedIn,(req,res)=>{
    res.render('edit',{u:req.user})

})

router.post('/editprofile',isLoggedIn,(req,res)=>{
    var us= new User();

    var newpassword= us.encryptPassword(req.body.password);
    User.findOneAndUpdate({username:req.user.username}, 
        {$set:{name:req.body.name,username:req.body.username,password:newpassword, phoneno:req.body.phoneno}},{new:true},(e,s)=>{
            if(e){
                res.send(e);
            }
            res.render('show',{u:s})
        })                 
})

router.get('/uploadfile',isLoggedIn,(req,res)=>{
    res.render('upload')
})

router.post('/uploadfile',isLoggedIn,upload.single('file'),(req,res)=>{
   var file= req.file
   res.redirect('/show')
})

module.exports = router;



