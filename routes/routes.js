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
router.post('/diary', controllers.diary)
router.get('/login',(req,res,next)=>{
    res.render('loginpage1',{pagetitle: 'Login', name: 'loginpage', isAuthenticated: false, invalid: false})
})
router.get('/logout',async (req,res,next)=>{
    req.session.destroy()
    res.redirect('/')
})
router.get('/entry',controllers.diarypage)

router.get('/new',(req,res)=>res.render('homepage1'))
// router.get('/entry',(req,res,next)=>{
//     res.render('myentries',{pagetitle: 'Diary', name: 'entrypage', isAuthenticated: false, passnomatch: false, title: "no entry found", content: ""})

// })
module.exports=router