const express= require('express')
const app=express()
require('dotenv').config()
const sequelize=require('./util/database')
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var options = {
	host: "eu-cdbr-west-02.cleardb.net",
	
	user: "b481f03d537d7e",
	password: "2a5d63b0",
	database: "heroku_8063a13ee0c730a",
    
};

var sessionStore = new MySQLStore(options);
const model=require('./models/models')
const routes=require('./routes/routes')
app.use(express.urlencoded({extended: false}))

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
		console.log("listening on 5000")})
}).catch(err=>{
    console.log(err)
})