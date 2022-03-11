const express= require('express')
const app=express()
require('dotenv').config()
const sequelize=require('./util/database')
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var options = {
	host: process.env.HOST,
	
	user: process.env.USER,
	password:  process.env.PASSWORD,
	database: process.env.DATABASE,
    
};
const path=require('path')
var sessionStore = new MySQLStore(options);
const model=require('./models/models')
const routes=require('./routes/routes')
app.use(express.urlencoded({extended: false}))
const publicdrc = path.join(__dirname,'./public')
app.use(express.static(publicdrc))
app.use(session({
    secret: 'Hey i am vaku the daku', resave: false, saveUninitialized: false,store: sessionStore
}))
app.set('view engine', 'ejs')
const User=model.User
const Diary=model.Entry
Diary.belongsTo(User,{constraints: true, onDelete: 'CASCADE' })
User.hasMany(Diary)
app.use(routes)
sequelize.sync().then(result=>{
    
    app.listen(process.env.PORT || 8000,()=>{
		console.log("listening on 8000")})
}).catch(err=>{
    console.log(err)
})