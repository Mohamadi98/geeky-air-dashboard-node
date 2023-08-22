const working_day_time_agent = require('../models/working_day_time')
const {Op} = require('sequelize')

const create = async (data) => {
    try {
        const result = await working_day_time_agent.bulkCreate(data);
        return result;
    } catch (error) {
        return `error creating a business: ${error}`
    }
}

module.exports = {
    create: create
}