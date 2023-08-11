const { DataTypes } = require('sequelize');
const connect_db = require('../db_config'); 

const db_client = connect_db();
const admin_agent = db_client.define('admin', {
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profile_image: {
    type: DataTypes.STRING
  },
  active: {
    type: DataTypes.BOOLEAN
  }
}, {
    timestamps: false,
    tableName: 'admin'
});

module.exports = admin_agent;