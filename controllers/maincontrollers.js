const bcrypt=require('bcryptjs')
const model=require('../models/models')
const express=require('express')
const User= model.User
const Diary=model.Entry
let date=new Date()
var day=date.getDate()
var month=date.getMonth()+1

const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
];
var monthname=monthNames[month]
var year=date.getFullYear()
const homepage=(req,res,next)=>{
    
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
            req.session.user=user
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
        date: ("0"+day).slice(-2)+"/"+("0"+month).slice(-2)+"/"+year,
        UserId: req.session.user[0].id
        
    }
    ).then(res.redirect('/')).catch((err)=>console.log(err))
}
const diary=(req,res,next)=>{
    console.log(req.body)
    Diary.findAll({where: {UserId: req.session.user[0].id}}).then((result)=>{
        if(result){
            result.forEach(element => {
                
                date1=element.dataValues.date.split('/')
                date2=req.body.date.split('-').reverse()
                console.log(date1, date2)
                if(JSON.stringify(date1)==JSON.stringify(date2))
                {
                     
                    title=element.dataValues.title
                    content=element.dataValues.content
                    res.render('myentries',{pagetitle: 'Diary', name: 'entrypage', isAuthenticated: false, passnomatch: false, title:title, content:content})
                }
                else{
                    res.render('myentries',{pagetitle: 'Diary', name: 'entrypage', isAuthenticated: false, passnomatch: false})
                }
                
            });
            
            
        }
    })
}

module.exports={homepage: homepage,
                registerpage: registerpage, register:register, login:login, entry:entry, diary:diary}