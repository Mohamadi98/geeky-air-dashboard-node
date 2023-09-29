const business_agent = require('../models/businessModel')
const post_agent = require('../models/postModel')
const { Op, sequelize } = require('sequelize')
const dateServices = require('../services/dateServices')

const create = async (data) => {
    try {
        const result = await post_agent.create(data);
        return result;
    } catch (error) {
        return `error creating a post: ${error}`
    }
}

const show_all_posts = async () => {
    try {
        const posts = await post_agent.findAll({
            include: {
                model: business_agent,
                attributes: ['name', 'logo'],
                required: true, 
            },
            where: {
                status: 'published'
            }
        });

        return posts;
    } catch (error) {
        return `Error fetching posts with business info: ${error}`;
    }
}

const seacrh_by_date = async (dateTime) => {
    try {
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

const update_post = async (post_data, id) => {
    try {
        const [affectedRowsCount, affectedRows] = await post_agent.update(post_data,
            {
                where: { 'id': id }
            }
        )
        return affectedRowsCount;
        }

    catch (error) {
       return `there was an error updating the post: ${error}`
    }
}


module.exports = {
    create: create,
    seacrh_by_date: seacrh_by_date,
    show_all_posts: show_all_posts,
    update_post: update_post
}