const Sequelize = require('sequelize')
require('dotenv').config()
const sequelize = new Sequelize("heroku_8063a13ee0c730a", "b481f03d537d7e", "2a5d63b0", {
    host: "eu-cdbr-west-02.cleardb.net",
    dialect : 'mysql',
    
    
  });
module.exports = sequelize
