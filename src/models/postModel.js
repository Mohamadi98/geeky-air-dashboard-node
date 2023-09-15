const { DataTypes } = require('sequelize');
const connect_db = require('../db_config'); 
const business_agent = require('../models/businessModel')

const db_client = connect_db();
const post_agent = db_client.define('post', {
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
    images: {
        type: DataTypes.ARRAY(DataTypes.STRING)
      },
      video: {
        type: DataTypes.STRING
      },
      text: {
        type: DataTypes.STRING
      },
      scheduled_at: {
        type: DataTypes.DATE
      },
      active: {
        type: DataTypes.BOOLEAN,
      },
      type: {
        type: DataTypes.STRING
      },
      websites: {
        type: DataTypes.JSONB
      },
      expire_at: {
        type: DataTypes.DATE
      }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'post',
});

business_agent.hasMany(post_agent, {
    foreignKey: 'business_id',
    onDelete: 'CASCADE',
  });
  post_agent.belongsTo(business_agent, {
    foreignKey: 'business_id'
  });

  module.exports = post_agent;
  