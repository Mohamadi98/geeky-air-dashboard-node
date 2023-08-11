const Sequelize = require('sequelize')
const dotenv = require('dotenv')

dotenv.config();

const connect_db = () => {
    try {
        const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING, {
            dialect: 'postgres',
          });
        console.log('database connected successfuly!');
        return sequelize
    } catch (error) {
        return `there was an error: ${error}`
    }
}

module.exports = connect_db;