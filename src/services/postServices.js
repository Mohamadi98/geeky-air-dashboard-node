const business_agent = require('../models/businessModel')
const post_agent = require('../models/postModel')
const business_services = require('../services/businessServices')
const { Op, QueryTypes } = require('sequelize')
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

const show_all_posts_website_request = async (website_name) => {
    try {
        const response = [];
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
        for (const post of posts) {
            const business_id = post.dataValues.business_id;
            const db_response = await business_services.posts_permission_checker(business_id, website_name);
            if (db_response.length > 0) {
                response.push(post);
            }
            else {
                continue;
            }
        }
        return response;
    } catch (error) {
        return `Error fetching posts with business info: ${error}`;
    }
}

const get_posts_by_business_id = async (website_name, business_id) => {
    const db_response = await business_services.posts_permission_checker(business_id, website_name);
    if (db_response.length > 0) {
        const posts = await post_agent.findAll({
            include: {
                model: business_agent,
                attributes: ['name', 'logo'],
                required: true,
            },
            where: {
                status: 'published',
                business_id: business_id
            }
        });
        return {
            status: 'success',
            data: posts
        }
    }
    else {
        return {
            status: 'failed',
            message: 'business id is not found or posts are disabeled for this website'
        }
    }
}

const fetch_post_by_id = async (id) => {
    try {
        const post = await post_agent.findOne({
            include: {
                model: business_agent,
                attributes: ['name', 'logo'],
                required: true,
            },
            where: {
                id: id
            }
        });
        return post;
    } catch (error) {
        return `error fetching post by id: ${error}`;
    }
}

const seacrh_by_date = async (dateTime) => {
    try {
        const posts = await post_agent.findAll({
            where: {
                [Op.and]: [
                    post_agent.sequelize.literal(`
                    EXISTS (
                      SELECT 1
                      FROM unnest(dates) AS date
                      WHERE DATE_TRUNC('minute', date) = DATE_TRUNC('minute', '${dateTime}'::timestamp)
                    )
                  `),
                    {
                        type: {
                            [Op.or]: ['scheduled', 'recurring'],
                        },
                    },
                    {
                        status: {
                            [Op.ne]: 'published',
                        },
                    },
                ],
            }
        });
        return posts
    } catch (error) {
        return `error fetching posts by date: ${error}`;
    }
}

const getPostsByDateAndType = async (startDate, endDate) => {
    try {
        const posts = await post_agent.findAll({
            where: {
                [Op.or]: [
                    post_agent.sequelize.literal(`
                        EXISTS (
                            SELECT 1
                            FROM unnest("dates") AS date
                            WHERE date_trunc('day', date) BETWEEN '${startDate}' AND '${endDate}'
                        ) AND "type" != 'publish'`
                    ),

                    post_agent.sequelize.literal(`
                        EXISTS (
                            SELECT 1
                            FROM "post"
                            WHERE date_trunc('day', "updated_at") BETWEEN '${startDate}' AND '${endDate}'
                            AND "type" = 'publish')`
                    )
                ]
            }
        });
        if (posts.length >= 0) {
            return {
                status: 'success',
                data: posts
            };
        }
    } catch (error) {
        return {
            status: 'failed',
            message: `Error fetching posts: ${error}`
        };
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

const update_published_post = async (post_data, id) => {
    try {
        const [affectedRowsCount, affectedRows] = await post_agent.update(post_data,
            {
                where: { 'id': id }
            }
        );
        if (affectedRowsCount > 0) {
            return {
                status: 'success',
                message: 'post updated successfuly!'
            }
        }
        else {
            return {
                status: 'failed',
                message: 'row not found'
            }
        }
    }
    catch (error) {
        return {
            status: 'error',
            message: `this error occurred: ${error}`
        }
    }
}

const fetch_filter_posts = async (postType) => {
    try {
        const result = await post_agent.findAll({
            include: {
                model: business_agent,
                attributes: ['name', 'logo'],
                required: true,
            },
            where: {
                type: postType
            }
        }
        )
        if (result.length >= 0) {
            return {
                status: 'success',
                data: result
            };
        }
    }
    catch (error) {
        return {
            status: 'error',
            message: `there was an error fetching the filtered posts: ${error}`
        }
    }
}

const fetch_filter_post_by_id = async (postType, id) => {
    try {
        const result = await post_agent.findAll({
            include: {
                model: business_agent,
                attributes: ['name', 'logo'],
                required: true,
            },
            where: {
                type: postType,
                business_id: id
            }
        }
        )
        if (result.length >= 0) {
            return {
                status: 'success',
                data: result
            };
        }
    }
    catch (error) {
        return {
            status: 'error',
            message: `there was an error fetching the filtered posts by id: ${error}`
        }
    }
}

const delete_by_id = async (id) => {
    try {
        const result = await post_agent.destroy({
            where: {
                id: id
            }
        });
        if (result > 0) {
            return {
                status: 'success',
                data: result,
                message: 'post deleted successfully!'
            };
        }
        else {
            return {
                status: 'success',
                data: [],
                message: `No post associated with this id: ${id}`
            };
        }
    }
    catch (error) {
        return {
            status: 'error',
            message: `there was an error deleting the post ${error}`
        }
    }
}

const deleteMultiplePosts = async (ids) => {
    try {
        const result = await post_agent.destroy({
            where: {
                id: {
                    [Op.in]: ids
                }
            }
        });
        if (result > 0) {
            return {
                status: 'success',
                message: 'posts deleted successfuly!'
            }
        }
        else if (result === 0) {
            return {
                status: 'success',
                message: 'No rows found matching the IDs'
            }
        }
    } catch (error) {
        return {
            status: 'failed',
            message: `error deleting posts: ${error}`
        }
    }
};

const get_updated_at_field = async (id) => {
    try {
        const created_at = await post_agent.findOne({
            where: {
                id: id
            },
            attributes: ['updated_at']
        });
        if (created_at) {
            return {
                status: 'success',
                data: created_at
            }
        }
        else {
            return {
                status: 'failed',
                message: 'post not found'
            }
        }
    } catch (error) {
        return {
            status: 'error',
            message: `there was an error: ${error}`
        }
    }
}

/**
 * 
 * this function was created to use a direct sql command to update a published post while retaining
 * the same updated_at field value from before the execution of the command
 * there was an issue updating the images field of type array using this command
 * the solution is to use the sequelize function update() to only update the images field as a temp 
 * solution
 */
const query_powered_update = async (postData, id) => {
    try {
        const postData2 = {
            images: postData.images
        }
        const [updatedRecord2] = await post_agent.update(postData2, {
            where: {
                id: id
            }
        });
        if (updatedRecord2 > 0) {
            console.log('images has been updated');
        }
        else {
            return {
                status: 'failed',
                message: 'post not found'
            }
        }
        const [updatedRecord] = await post_agent.sequelize.query(
            'UPDATE post SET content = :content, updated_at = :updated_at, italic = :italic, bold = :bold, video = :video WHERE id = :id RETURNING *',
            {
                replacements: {
                    images: postData.images,
                    video: postData.video,
                    content: postData.content,
                    italic: postData.italic,
                    bold: postData.bold,
                    updated_at: postData.updated_at,
                    id: id,
                },
                type: QueryTypes.UPDATE
            }
        );
        if (updatedRecord) {
            return {
                status: 'success',
                message: 'post updated successfuly!'
            }
        }
        else {
            return {
                status: 'failed',
                message: 'post not found'
            }
        }
    } catch (error) {
        return {
            status: 'error',
            message: `this error occurred: ${error}`
        }
    }
}

module.exports = {
    create: create,
    seacrh_by_date: seacrh_by_date,
    show_all_posts: show_all_posts,
    update_post: update_post,
    show_all_posts_website_request: show_all_posts_website_request,
    fetch_post_by_id: fetch_post_by_id,
    fetch_filter_posts: fetch_filter_posts,
    fetch_filter_post_by_id: fetch_filter_post_by_id,
    delete_by_id: delete_by_id,
    getPostsByDateAndType: getPostsByDateAndType,
    deleteMultiplePosts: deleteMultiplePosts,
    get_posts_by_business_id: get_posts_by_business_id,
    update_published_post: update_published_post,
    get_updated_at_field: get_updated_at_field,
    query_powered_update: query_powered_update
}