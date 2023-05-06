const Sequelize = require("sequelize");
const sqDB = require("../config/db.connection");
const {TINYINT} = require("sequelize");

module.exports = sqDB.SequelizeObject.define(
    'customer_invalid_data', {
        first_name: {
            type: Sequelize.STRING,
        },
        last_name: {
            type: Sequelize.STRING,
        },
        city: {
            type: Sequelize.STRING,
        },
        statecode: {
            type: Sequelize.STRING,
        },
        postcode: {
            type: Sequelize.STRING,
        },
        phone: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        ip: {
            type: Sequelize.STRING
        },
        status: {
            type: TINYINT,
            default: 1
        }
    });

