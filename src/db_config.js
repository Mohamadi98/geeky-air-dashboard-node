const Sequelize = require('sequelize')
const dotenv = require('dotenv')

dotenv.config();
const {
    DATABASE_NAME,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    DATABASE_HOST,
    DIALECT
  } = process.env;

const db_client = new Sequelize(DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD,
    {
        host: DATABASE_HOST,
        dialect: DIALECT
    });
console.log('database connected successfuly!');

module.exports = db_client;