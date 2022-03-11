const bcrypt=require('bcryptjs')
const model=require('../models/models')
const express=require('express')
const User= model.User
const Diary=model.Entry
let date=new Date()
var day=date.getDate()
var month=date.getMonth()+1
const markdownit= require('markdown-it'),
md=new markdownit()

const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
];
var monthname=monthNames[month]
var year=date.getFullYear()

const homepage=(req,res,next)=>{
    var todaydate=("0"+day).slice(-2)+"/"+("0"+month).slice(-2)+"/"+year
    isLoggedIn=req.session.isLoggedIn===true
    console.log(req.session)
    if(isLoggedIn===true){
    Diary.findAll({where: {UserId: req.session.user.id, date: todaydate}}).then((result)=>{
        if(result[0]!=null){
            
            res.render('homepage',{pagetitle: 'Home', name: 'homepage', isAuthenticated: isLoggedIn, username: req.session.username, day: day, month: monthname, year: year, title: result[0].dataValues.title, content: result[0].dataValues.content})
        }
        else{
            res.render('homepage',{pagetitle: 'Home', name: 'homepage', isAuthenticated: isLoggedIn, username: req.session.username, day: day, month: monthname, year: year, title: '', content: ''})
            
        }
        
    })
}else{
    res.render('homepage',{pagetitle: 'Home', name: 'homepage', isAuthenticated: isLoggedIn, username: req.session.username, day: day, month: monthname, year: year, title: '', content: ''})
    
}
}
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
            }).then((user)=>{
                User.findOne({where: {email: email}}).then((user)=>{
                    console.log(user)
                    req.session.isLoggedIn=true
                    req.session.user=user
                    return res.redirect('/')
                }).catch(err=>console.log(err))
                
            }).catch(err=>{
                console.log(err)
            })
            
            
            
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
        if(user[0]!=null){
        console.log(user[0].password)
        bcrypt.compare(password, user[0].password).then((result)=>{
            if(result) {
                req.session.user=user[0]
                req.session.isLoggedIn=true
                console.log(user[0].name)
                req.session.id=user[0].id
                
                req.session.username=user[0].name
                return res.redirect('/')
            }
            else{
                const isLoggedIn= req.session.isLoggedIn===true
                res.render('loginpage',{pagetitle: 'Login', name: 'loginpage', isAuthenticated: isLoggedIn, invalid: true})
            }
        
    
        }).catch((err)=>console.log(err))
    }
    else{
        const isLoggedIn= req.session.isLoggedIn===true
        res.render('loginpage',{pagetitle: 'Login', name: 'loginpage', isAuthenticated: isLoggedIn, invalid: true})
    }
    })
}
const entry=(req,res,next)=>{
    var todaydate=("0"+day).slice(-2)+"/"+("0"+month).slice(-2)+"/"+year
    isLoggedIn=req.session.isLoggedIn===true
    console.log(req.body.title)
    
    Diary.findOne({where: {date: todaydate}}).then((entries)=>{
        
        console.log(entries)
        if(entries!=null){
            
            entries.title=req.body.title
            console.log(req.body.entry)
            entries.content=req.body.entry
            entries.UserId=req.session.user.id
            console.log(entries.dataValues.content)
            entries.save()
            console.log(entries.dataValues.content)
            res.redirect('/')
           
        }
        else{
            Diary.create({
                title: req.body.title,
                content: req.body.entry,
                date: ("0"+day).slice(-2)+"/"+("0"+month).slice(-2)+"/"+year,
                UserId: req.session.user.id
                
            }
            ).then(res.redirect('/')).catch((err)=>console.log(err))
        }


    }).catch((err)=>console.log(err))
    



    
}
const diary=(req,res,next)=>{
    const isLoggedIn=req.session.isLoggedIn===true
    console.log(req.body.date)
    date2=req.body.date.split('-').reverse()
    
    todaydate=date2.join("/")
    console.log(todaydate)
    Diary.findAll({where: {UserId: req.session.user.id}}).then((result)=>{
        if(result){
            result.forEach(element => {
                if(element.dataValues.date==todaydate){
                    title=element.dataValues.title
                    content= md.render(element.dataValues.content)
                    res.render('myentries',{pagetitle: 'Diary', name: 'entrypage', isAuthenticated: isLoggedIn, passnomatch: false,array:result, title:title, content:content})
                }
            });
          } 
                
            });
            
            
        }
    
const diarypage=(req,res,next)=>{
    const isLoggedIn=req.session.isLoggedIn===true
    Diary.findAll({where: {UserId: req.session.user.id}}).then((result)=>{
        if(result){
            
                console.log(result)
                
                title=null
                content=null     
                
                res.render('myentries',{pagetitle: 'Diary', name: 'entrypage', isAuthenticated: isLoggedIn, passnomatch: false,array:result, title:title, content:content})
            
                
                
        }
    });
}      
   
module.exports={homepage: homepage,
                registerpage: registerpage, register:register, login:login, entry:entry, diary:diary, diarypage:diarypage}