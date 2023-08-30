const business_agent = require('../models/businessModel')
const working_day_time_agent = require('../models/working_day_time')
const {Op, sequelize} = require('sequelize')

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

const delete_business_by_id = async (id) => {
    try {
        const result = await business_agent.destroy({
            where: {
              'id': id
            }
          });
          return result;
    } catch (error) {
        return `there was an error deleting business: ${error}`
    }
}

const update_business_by_id = async (business_data, id) => {
    try {
            const result = await business_agent.update(business_data,
                {
                    where: { 'id': id }
                }
            )
            return result;
        }

    catch (error) {
       return `there was an error updating the business: ${error}`
    }
}

const fetch_business_via_website_request = async (website_name) => {
    try {
        const result = await business_agent.findAll({
            include: working_day_time_agent,
            where: {
                websites: {
                    [Op.contains]: [{
                           "website_name": website_name ,
                           "website_value": true 
                      }]
                  }
              }
          })
          return result
    } catch (error) {
        return `error fetching all businesses: ${error}`
    }
}

const filter_businesses_website_request = async (website_name, filter_object) => {
    try {
        const where_values = {
            state: filter_object.state,
            city1: filter_object.city,
            city_zip: filter_object.zip,
            [Op.and]: [
                {
                    websites: {
                        [Op.contains]: [{ website_name: website_name, website_value: true }],
                    },
                },
            ],
        };
        Object.keys(where_values).forEach((key) => {
            if (where_values[key] === undefined) {
                delete where_values[key];
            }
        });
        const result = await business_agent.findAll({
            attributes: ['id', 'logo', 'street', 'state', 'city1', 'city2', 'description', 'likes', 'name'], 
            where: where_values
          });
          return result;
    } catch (error) {
        return `error filtering the data: ${error}`
    }
}

module.exports = {
    create: create,
    fetch_business_by_email_phone: fetch_business_by_email_phone,
    show_all_businesses: show_all_businesses,
    fetch_business_by_id: fetch_business_by_id,
    update_business_by_id: update_business_by_id,
    delete_business_by_id: delete_business_by_id,
    fetch_business_via_website_request: fetch_business_via_website_request,
    filter_businesses_website_request: filter_businesses_website_request
}