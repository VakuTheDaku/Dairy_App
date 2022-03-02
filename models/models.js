const Sequelize =  require('sequelize')
const sequelize = require('../util/database')
let date=new Date()
var day=date.getDate()
var month=date.getMonth()
const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
];
var monthname=monthNames[month]
var year=date.getFullYear()
const User = sequelize.define('User', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    }
})
const Entry = sequelize.define('Entry', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    date: {
        type: Sequelize.STRING,
        allowNull: false,
        
    }
})
module.exports= {
    User:User,
    Entry: Entry
}