const business_agent = require('../models/businessModel')
const post_agent = require('../models/postModel')
const { Op, sequelize } = require('sequelize')
const dateServices = require('../services/dateServices')

const create = async (data) => {
    try {
        const result = await post_agent.create(data);
        console.log(result);
        return result;
    } catch (error) {
        return `error creating a post: ${error}`
    }
}

const seacrh_by_date = async () => {
    try {
        const date = '2023-09-30';
        const time = '21:40:25';
        const dateTime = dateServices.convert_from_est_to_utc(date, time);
        console.log({dateTime});
        // const timestamp = dateTime.toISOString().replace('T', ' ').replace('Z', '');
        // console.log(timestamp);
        const posts = await post_agent.findAll({
            where: post_agent.sequelize.literal(`
                EXISTS (
                    SELECT 1
                    FROM unnest(dates) AS date
                    WHERE DATE_TRUNC('minute', date) = DATE_TRUNC('minute', '${dateTime}'::timestamp)
                );
            `),
        });
        return posts
    } catch (error) {
        return `error fetching posts by date: ${error}`;
    }
}

module.exports = {
    create: create,
    seacrh_by_date: seacrh_by_date
}