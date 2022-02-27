const express=require('express')
const bcrypt= require('bcryptjs')
const ejs= require('ejs')
const router = express.Router()
const controllers = require('../controllers/maincontrollers')
router.get('/',controllers.homepage)
router.get('/register',controllers.registerpage)
router.post('/store',controllers.register)
router.post('/login',controllers.login)
router.post('/entry',controllers.entry)
router.get('/login',(req,res,next)=>{
    res.render('loginpage',{pagetitle: 'Login', name: 'loginpage', isAuthenticated: false, passnomatch: false})
})
router.get('/logout',async (req,res,next)=>{
    req.session.destroy()
    res.redirect('/')
})
router.get('/entry',(req,res,next)=>{
    res.render('myentries',{pagetitle: 'Diary', name: 'entrypage', isAuthenticated: false, passnomatch: false})

})
module.exports=router