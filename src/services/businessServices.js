const business_agent = require('../models/businessModel')
const working_day_time_agent = require('../models/working_day_time')
const {Op} = require('sequelize')

const create = async (data) => {
    try {
        const result = await business_agent.create(data);
        return result;
    } catch (error) {
        return `error creating a business: ${error}`
    }
}

const fetch_business_by_email_phone = async (email_value, phone_value) => {
    try {
        const result = await business_agent.findOne({
            where: {
                [Op.or]: [
                  { email: email_value },
                  { phone_number: phone_value }
                ]
            }
        });
        return result;
    } catch (error) {
        return `error fetching business with email or phone: ${error}`
    }
}

const fetch_business_by_id = async (id) => {
    try {
        const result = await business_agent.findOne({
            include: working_day_time_agent,
            where: {
                id: id
            }
          })
          return result
    } catch (error) {
        return `error fetching all businesses: ${error}`
    }
}

const show_all_businesses = async () => {
    try {
        const result = await business_agent.findAll({
            attributes: ['id', 'logo', 'web_site', 'created_at', 'name', 'expire_at', 'street', 'state', 'city1', 'city2', 'city_zip', 'phone_number']
        });
        return result;
    } catch (error) {
        return `error showing all businesses: ${error}`
    }
}

module.exports = {
    create: create,
    fetch_business_by_email_phone: fetch_business_by_email_phone,
    show_all_businesses: show_all_businesses,
    fetch_business_by_id: fetch_business_by_id
}