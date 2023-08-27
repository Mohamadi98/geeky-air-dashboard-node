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

const delete_data = async (id) => {
    try {
        const result = await working_day_time_agent.destroy({
            where: {
              'business_id': id
            }
    });
    return result;
    } catch (error) {
        return `error deleting working_day_time table data: ${error}`
    }
}

const update = async (data, id) => {
    try {
        const result = await delete_data(id);
        if (result) {
            const result2 = await create(data);
            return result2;
        }
        else {
            return `error in working_day_time update function:`
        }
    }

    catch (error) {
        return `there was an error updating the working_day_time table: ${error}`
    }
}

module.exports = {
    create: create,
    update: update
}