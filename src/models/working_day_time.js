const { DataTypes } = require('sequelize');
const connect_db = require('../db_config'); 
const business_agent = require('../models/businessModel')

const db_client = connect_db();
const working_day_time_agent = db_client.define('business', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        },
    business_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'business', 
            key: 'id'      
          },
    },
    open: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      day: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      start_time: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      end_time: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      open_24h: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      }
}, {
    timestamps: false,
    tableName: 'working_day_time'
}
);

business_agent.hasMany(working_day_time_agent, {
    foreignKey: 'business_id',
    onDelete: 'CASCADE',
  });
  working_day_time_agent.belongsTo(business_agent, {
    foreignKey: 'business_id'
  });

  module.exports = working_day_time_agent;
  