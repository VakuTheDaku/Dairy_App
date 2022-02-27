const Sequelize = require('sequelize')
const sequelize = new Sequelize('DiaryApp', 'root', '', {
    host: "127.0.0.1",
    dialect : 'mysql',
    port: '8111',
    
  });
module.exports = sequelize