const Sequelize = require("sequelize");
const sqDB = {};
const SequelizeObject = new Sequelize(
    "database_name","username","password", {
        host     : '127.0.0.1',
        dialect: 'mysql',
        // operatorsAliases : false,
        pool:{
            max:100,
            min:0,
            acquire:60000,
            idle: 30000
        },
        define: {
            freezeTableName: true
        },
        timeZone:'Asia/Dhaka'
    })

sqDB.Sequelize=Sequelize;
sqDB.SequelizeObject = SequelizeObject;

module.exports = sqDB;
