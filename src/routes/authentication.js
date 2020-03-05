const express = require('express');
const router = express.Router();
const pool = require('../database');

const passport = require('passport');
const {isLoggedIn} =require('../lib/auh');




router.get('/signup',  (req, res)=>{
    res.render('autenti/signup');
});

router.post('/signup', passport.authenticate('local.signup',{
    successRedirect: '/admin',
    failureRedirect: '/signup',
    failureFlash: true
 
}));


router.get('/sigin', (req, res)=>{
    res.render('autenti/sigin');
});


router.post('/sigin', (req, res, next) =>{
    passport.authenticate('local.sigin',{
        successRedirect: '/admin',
        failureRedirect: '/sigin',
        failureFlash: true
    })(req, res, next);
    
   
 });
 router.get('/logout', (req, res) =>{
        req.logOut();
        res.redirect('/sigin')


 })
 



module.exports = router;