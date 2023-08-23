const { DataTypes } = require('sequelize');
const connect_db = require('../db_config'); 

const db_client = connect_db();
const business_agent = db_client.define('business', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        },
    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    phone_no: {
        type: DataTypes.STRING,
        unique: true
    },
    category: {
        type: DataTypes.STRING
    },
    state: {
        type: DataTypes.STRING
    },
    website: {
        type: DataTypes.STRING
    },
    street: {
        type: DataTypes.STRING
    },
    city_zip: {
        type: DataTypes.STRING
    },
    city1: {
        type: DataTypes.STRING
    },
    city2: {
        type: DataTypes.STRING
    },
    tags: {
        type: DataTypes.ARRAY(DataTypes.STRING)
    },
    logo: {
        type: DataTypes.STRING
    },
    likes: {
        type: DataTypes.INTEGER
    },
    expire_at: {
        type: DataTypes.DATE
    }
}, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    tableName: 'business'
});

module.exports = business_agent;