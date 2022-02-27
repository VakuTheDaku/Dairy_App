const bcrypt=require('bcryptjs')
const model=require('../models/models')
const express=require('express')
const User= model.User
const Diary=model.Entry
const homepage=(req,res,next)=>{
    let date=new Date()
    var day=date.getDate()
    var month=date.getMonth()
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];
    var monthname=monthNames[month]
    var year=date.getFullYear()
    res.render('homepage',{pagetitle: 'Home', name: 'homepage', isAuthenticated: req.session.isLoggedIn, username: req.session.username, day: day, month: monthname, year: year})}
const registerpage=(req,res,next)=>{
    res.render('register',{pagetitle: 'Register', name: 'registerpage', isAuthenticated: false, sameemail: false })}
const register=async (req,res,next)=>{
    console.log(req.body)
    const {username, email, password}= req.body
    User.findAll({where: {email: email}}).then(async (users)=>{
        
        if(!users[0]){
            let hashedpass =await bcrypt.hash(password, 8)
            User.create({
                name: username,
                email: email,
                password: hashedpass,
            }).then().catch(err=>{
                console.log(err)
            })
            req.session.isLoggedIn=true
            res.redirect('/')
        }
        else{
            req.session.isLoggedIn=false
            res.render('register',{pagetitle: 'Register', name: 'registerpage', isAuthenticated: req.session.isLoggedIn, sameemail: true})
        
        }


    }).catch((err)=>console.log(err))
    
}
const login=(req,res,next)=>{
    
    email=req.body.email
    password=req.body.password
    
    User.findAll({where: {email: email}}).then(async (user)=>{
        console.log(user[0].password)
        bcrypt.compare(password, user[0].password).then((result)=>{
            if(result) {
                req.session.user=user
                req.session.isLoggedIn=true
                console.log(user[0].name)
                req.session.id=user[0].id
                
                req.session.username=user[0].name
                return res.redirect('/')
            }
            else{
                const isLoggedIn= req.session.isLoggedIn===true
                res.render('loginpage',{pagetitle: 'Login', name: 'loginpage', isAuthenticated: isLoggedIn, passnomatch: true})
            }
    
        }).catch((err)=>console.log(err))
    })
}
const entry=(req,res,next)=>{
    
    Diary.create({
        title: req.body.title,
        content: req.body.entry,
        UserId: req.session.user[0].id
    }
    ).then(res.redirect('/')).catch((err)=>console.log(err))
}
const myentry=(req,res,next)=>{
    Diary.findAll({where: {UserId: req.session.user[0].id}}).then((result)=>{
        if(result){
            res.render('myentries')
        }
    })
}
module.exports={homepage: homepage,
                registerpage: registerpage, register:register, login:login, entry:entry}