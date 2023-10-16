const express = require('express')
const dotenv = require('dotenv')
const postServices = require('../services/postServices')
const dateServices = require('../services/dateServices')
const middlewares = require('../middlewares/check_if_admin_active')
const S3Services = require('../services/awsS3Services')
const recurringServices = require('../services/createRecurringDates')
const moment = require('moment-timezone')


dotenv.config();
const postRouter = express.Router();

const add_post = async (req, res) => {
    const request_data = req.body;
    if (request_data['business_id'] === undefined) {
        return res.status(400).json({
            'message': 'business id is undefined'
        });
    }
    const time = request_data['time'];
    if (request_data['images'].length > 0) {
        request_data['images'] = await S3Services.upload_post_images(request_data['business_id'], request_data['images']);
    }
    if (request_data['video'] !== "") {
        request_data['video'] = await S3Services.upload_post_video(request_data['video'], request_data['business_id']);
    }

    if (request_data['type'] === 'publish') {

        const data = {
            business_id: request_data['business_id'],
            images: request_data['images'],
            video: request_data['video'],
            content: request_data['content'],
            status: 'published',
            type: request_data['type'],
            italic: request_data['italic'],
            bold: request_data['bold'],
            title: request_data['title'],
            integrations: request_data['integrations'],
        }

        const db_response = await postServices.create(data);
        if (db_response.id) {
            res.status(200).json({
                'message': 'post created successfuly!'
            });
        }
        else {
            res.status(500).json({
                db_response
            })
        }

    }
    else if (request_data['type'] === 'scheduled') {
        const date = request_data['schedule_date'];

        const newDateTime = dateServices.create_est_with_date_and_time(date, time);

        const data = {
            business_id: request_data['business_id'],
            images: request_data['images'],
            video: request_data['video'],
            content: request_data['content'],
            status: 'scheduled',
            type: request_data['type'],
            italic: request_data['italic'],
            bold: request_data['bold'],
            title: request_data['title'],
            integrations: request_data['integrations'],
            dates: [newDateTime],
            time: request_data['time'],
            u_scheduled_date: request_data['u_scheduled_date'],
        }

        const db_response = await postServices.create(data);
        if (db_response.id) {
            res.status(200).json({
                'message': 'post created successfuly!'
            });
        }
        else {
            res.status(500).json({
                db_response
            })
        }
    }
    else if (request_data['type'] === 'recurring') {
        if (request_data['recurring_for'] === 'Week') {
            const daysOfTheWeek = dateServices.convert_days_arr_to_num_arr(request_data['recurring_on']);
            const everyWeek = request_data['recurring_every'];
            const startingDate = dateServices
                .create_est_with_date_and_time(request_data['start_date'],
                    time);
            const endingDate = dateServices
                .create_est_with_date_and_time(request_data['end_date'],
                    time);
            const dates = recurringServices.createRecurringDatesByWeek(daysOfTheWeek,
                everyWeek, startingDate, endingDate);

            const data = {
                business_id: request_data['business_id'],
                images: request_data['images'],
                video: request_data['video'],
                content: request_data['content'],
                status: 'scheduled',
                type: request_data['type'],
                italic: request_data['italic'],
                bold: request_data['bold'],
                title: request_data['title'],
                integrations: request_data['integrations'],
                dates: dates,
                time: request_data['time'],
                recurring_every: request_data['recurring_every'],
                recurring_for: request_data['recurring_for'],
                recurring_on: request_data['recurring_on'],
                u_start_date: request_data['u_start_date'],
                u_end_date: request_data['u_end_date'],
                u_selected_days: [],
                expire_at: endingDate,
            }
            const db_response = await postServices.create(data);
            if (db_response.id) {
                res.status(200).json({
                    'message': 'post created successfuly!'
                });
            }
            else {
                res.status(500).json({
                    db_response
                });
            }
        }
        else if (request_data['recurring_for'] === 'Month') {
            const daysOfTheMonth = request_data['selected_days'];
            const everyMonth = request_data['recurring_every'];
            const endingDate = dateServices
                .create_est_with_date_and_time(request_data['end_date'],
                    time);
            const dates = recurringServices.createRecurringDatesByMonth(daysOfTheMonth,
                everyMonth, endingDate, time);

            const data = {
                business_id: request_data['business_id'],
                images: request_data['images'],
                video: request_data['video'],
                content: request_data['content'],
                status: 'scheduled',
                type: request_data['type'],
                italic: request_data['italic'],
                bold: request_data['bold'],
                title: request_data['title'],
                integrations: request_data['integrations'],
                dates: dates,
                time: request_data['time'],
                recurring_every: request_data['recurring_every'],
                recurring_for: request_data['recurring_for'],
                u_end_date: request_data['u_end_date'],
                u_selected_days: request_data['u_selected_days'],
                expire_at: endingDate,
            }
            const db_response = await postServices.create(data);
            if (db_response.id) {
                res.status(200).json({
                    'message': 'post created successfuly!'
                });
            }
            else {
                res.status(500).json({
                    db_response
                });
            }
        }
        else if (request_data['recurring_for'] === 'Year') {
            const yearDates = request_data['selected_days'];
            const dates = [];
            for (const date of yearDates) {
                dates.push(dateServices.create_est_with_date_and_time(
                    date, time));
            }

            const data = {
                business_id: request_data['business_id'],
                images: request_data['images'],
                video: request_data['video'],
                content: request_data['content'],
                status: 'scheduled',
                type: request_data['type'],
                italic: request_data['italic'],
                bold: request_data['bold'],
                title: request_data['title'],
                integrations: request_data['integrations'],
                time: request_data['time'],
                recurring_every: request_data['recurring_every'],
                recurring_for: request_data['recurring_for'],
                u_end_date: request_data['u_end_date'],
                u_selected_days: request_data['u_start_date'],
                dates: dates,
            }

            const db_response = await postServices.create(data);
            if (db_response.id) {
                res.status(200).json({
                    'message': 'post created successfuly!'
                });
            }
            else {
                res.status(500).json({
                    db_response
                });
            }
        }
        else {
            res.status(400).json({
                'message': 'invalid recurrance type'
            });
        }
    }
    else if (request_data['type'] === 'draft') {
        const date = request_data['schedule_date'];
        const newDateTime = dateServices.create_est_with_date_and_time(date, time);
        const data = {
            business_id: request_data['business_id'],
            images: request_data['images'],
            video: request_data['video'],
            content: request_data['content'],
            status: 'draft',
            type: request_data['type'],
            italic: request_data['italic'],
            bold: request_data['bold'],
            title: request_data['title'],
            dates: [newDateTime],
            time: request_data['time'],
            u_scheduled_date: request_data['u_scheduled_date'],
            integrations: request_data['integrations'],
        }

        const db_response = await postServices.create(data);
        if (db_response.id) {
            res.status(200).json({
                'message': 'post created successfuly!'
            });
        }
        else {
            res.status(500).json({
                db_response
            });
        }
    }
    else {
        res.status(400).json({
            'message': 'invalid post type'
        });
    }
}

const update_post = async (req, res) => {
    const id = req.body.id;
    const request_data = req.body;
    delete request_data['id'];
    if (request_data['business_id'] === undefined) {
        return res.status(400).json({
            'message': 'business id is undefined'
        });
    }
    const time = request_data['time'];
    if (request_data['images'].length > 0) {
        request_data['images'] = await S3Services.upload_post_images(request_data['business_id'], request_data['images']);
    }
    if (request_data['video'] !== "") {
        request_data['video'] = await S3Services.upload_post_video(request_data['video'], request_data['business_id']);
    }
    if (request_data['type'] === 'publish') {

        const data = {
            business_id: request_data['business_id'],
            images: request_data['images'],
            video: request_data['video'],
            content: request_data['content'],
            status: 'published',
            type: request_data['type'],
            italic: request_data['italic'],
            bold: request_data['bold'],
            title: request_data['title'],
            dates: [],
            recurring_for: "",
            recurring_on: [],
            u_start_date: "",
            u_end_date: "",
            u_selected_days: [],
            u_scheduled_date: "",
            integrations: request_data['integrations'],
        }

        const db_response = await postServices.update_post(data, id);
        if (db_response > 0) {
            res.status(200).json({
                'message': 'post updated successfuly!',
                'status': 'success'
            });
        }
        else if (db_response === 0) {
            res.status(200).json({
                'message': 'No rows found with this id',
                'status': 'failed'
            })
        }
        else {
            res.status(500).json({
                'message': db_response,
                'status': 'failed'
            });
        }

    }

    else if (request_data['type'] === 'scheduled') {
        const date = request_data['schedule_date'];
        const newDateTime = dateServices.create_est_with_date_and_time(date, time);

        const data = {
            business_id: request_data['business_id'],
            images: request_data['images'],
            video: request_data['video'],
            content: request_data['content'],
            status: 'scheduled',
            type: request_data['type'],
            italic: request_data['italic'],
            bold: request_data['bold'],
            title: request_data['title'],
            integrations: request_data['integrations'],
            dates: [newDateTime],
            time: request_data['time'],
            recurring_for: "",
            recurring_on: [],
            u_start_date: "",
            u_end_date: "",
            u_selected_days: [],
            u_scheduled_date: request_data['u_scheduled_date'],
        }

        const db_response = await postServices.update_post(data, id);
        if (db_response > 0) {
            res.status(200).json({
                'message': 'post updated successfuly!',
                'status': 'success'
            });
        }
        else if (db_response === 0) {
            res.status(200).json({
                'message': 'No rows found with this id',
                'status': 'failed'
            })
        }
        else {
            res.status(500).json({
                'message': db_response,
                'status': 'failed'
            });
        }
    }

    else if (request_data['type'] === 'recurring') {
        if (request_data['recurring_for'] === 'Week') {
            const daysOfTheWeek = dateServices.convert_days_arr_to_num_arr(request_data['recurring_on']);
            const everyWeek = request_data['recurring_every'];
            const startingDate = dateServices
                .create_est_with_date_and_time(request_data['start_date'],
                    time);
            const endingDate = dateServices
                .create_est_with_date_and_time(request_data['end_date'],
                    time);
            const dates = recurringServices.createRecurringDatesByWeek(daysOfTheWeek,
                everyWeek, startingDate, endingDate);

            const data = {
                business_id: request_data['business_id'],
                images: request_data['images'],
                video: request_data['video'],
                content: request_data['content'],
                status: 'scheduled',
                type: request_data['type'],
                italic: request_data['italic'],
                bold: request_data['bold'],
                title: request_data['title'],
                integrations: request_data['integrations'],
                dates: dates,
                time: request_data['time'],
                recurring_every: request_data['recurring_every'],
                recurring_for: request_data['recurring_for'],
                recurring_on: request_data['recurring_on'],
                u_start_date: request_data['u_start_date'],
                u_end_date: request_data['u_end_date'],
                u_selected_days: [],
                u_scheduled_date: "",
                expire_at: endingDate,
            }
            const db_response = await postServices.update_post(data, id);
            if (db_response > 0) {
                res.status(200).json({
                    'message': 'post updated successfuly!',
                    'status': 'success'
                });
            }
            else if (db_response === 0) {
                res.status(200).json({
                    'message': 'No rows found with this id',
                    'status': 'failed'
                })
            }
            else {
                res.status(500).json({
                    'message': db_response,
                    'status': 'failed'
                });
            }
        }
        else if (request_data['recurring_for'] === 'Month') {
            const daysOfTheMonth = request_data['selected_days'];
            const everyMonth = request_data['recurring_every'];
            const endingDate = dateServices
                .create_est_with_date_and_time(request_data['end_date'],
                    time);
            const dates = recurringServices.createRecurringDatesByMonth(daysOfTheMonth,
                everyMonth, endingDate, time);
            console.log(dates);

            const data = {
                business_id: request_data['business_id'],
                images: request_data['images'],
                video: request_data['video'],
                content: request_data['content'],
                status: 'scheduled',
                type: request_data['type'],
                italic: request_data['italic'],
                bold: request_data['bold'],
                title: request_data['title'],
                integrations: request_data['integrations'],
                dates: dates,
                time: request_data['time'],
                recurring_every: request_data['recurring_every'],
                recurring_for: request_data['recurring_for'],
                recurring_on: [],
                u_start_day: "",
                u_end_date: request_data['u_end_date'],
                u_selected_days: request_data['u_selected_days'],
                u_scheduled_date: "",
                expire_at: endingDate,
            }
            const db_response = await postServices.update_post(data, id);
            if (db_response > 0) {
                res.status(200).json({
                    'message': 'post updated successfuly!',
                    'status': 'success'
                });
            }
            else if (db_response === 0) {
                res.status(200).json({
                    'message': 'No rows found with this id',
                    'status': 'failed'
                })
            }
            else {
                res.status(500).json({
                    'message': db_response,
                    'status': 'failed'
                });
            }
        }
        else if (request_data['recurring_for'] === 'Year') {
            const yearDates = request_data['start_date'];
            const dates = [];
            for (const date of yearDates) {
                dates.push(dateServices.create_est_with_date_and_time(
                    date, time));
            }

            const data = {
                business_id: request_data['business_id'],
                images: request_data['images'],
                video: request_data['video'],
                content: request_data['content'],
                status: 'scheduled',
                type: request_data['type'],
                italic: request_data['italic'],
                bold: request_data['bold'],
                title: request_data['title'],
                integrations: request_data['integrations'],
                time: request_data['time'],
                recurring_every: request_data['recurring_every'],
                recurring_for: request_data['recurring_for'],
                recurring_on: [],
                u_start_date: "",
                u_end_date: request_data['u_end_date'],
                u_selected_days: request_data['u_selected_days'],
                u_scheduled_date: "",
                dates: dates,
            }

            const db_response = await postServices.update_post(data, id);
            if (db_response > 0) {
                res.status(200).json({
                    'message': 'post updated successfuly!',
                    'status': 'success'
                });
            }
            else if (db_response === 0) {
                res.status(200).json({
                    'message': 'No rows found with this id',
                    'status': 'failed'
                })
            }
            else {
                res.status(500).json({
                    'message': db_response,
                    'status': 'failed'
                });
            }
        }
        else {
            res.status(400).json({
                'message': 'invalid recurrance type'
            });
        }
    }

    else if (request_data['type'] === 'draft') {
        const date = request_data['schedule_date'];
        const newDateTime = dateServices.create_est_with_date_and_time(date, time);
        const data = {
            business_id: request_data['business_id'],
            images: request_data['images'],
            video: request_data['video'],
            content: request_data['content'],
            status: 'draft',
            type: request_data['type'],
            italic: request_data['italic'],
            bold: request_data['bold'],
            title: request_data['title'],
            integrations: request_data['integrations'],
            dates: [newDateTime],
            time: request_data['time'],
            recurring_for: "",
            recurring_on: [],
            u_start_date: "",
            u_end_date: "",
            u_selected_days: [],
            u_scheduled_date: request_data['u_scheduled_date'],
        }

        const db_response = await postServices.update_post(data, id);
        if (db_response > 0) {
            res.status(200).json({
                'message': 'post updated successfuly!',
                'status': 'success'
            });
        }
        else if (db_response === 0) {
            res.status(200).json({
                'message': 'No rows found with this id',
                'status': 'failed'
            })
        }
        else {
            res.status(500).json({
                'message': db_response,
                'status': 'failed'
            });
        }
    }
    else {
        res.status(400).json({
            'message': 'invalid post type'
        });
    }
}

const get_post_by_id = async (req, res) => {
    const { id } = req.params;
    const db_response = await postServices.fetch_post_by_id(id);
    const updated_at = db_response.dataValues['updated_at']
    const timeDifference = dateServices.get_time_difference(updated_at);
    db_response.dataValues['postTime'] = timeDifference;
    if (db_response) {
        res.status(200).json({
            'data': db_response
        });
    }
    else {
        res.status(400).json({
            'message': `No data found with this id:${id}`
        });
    }
}

const get_posts_website_request = async (req, res) => {
    const { website_name } = req.params;
    const db_response = await postServices.show_all_posts_website_request(website_name);

    for (let i = 0; i < db_response.length; i++) {
        const timeDifference = dateServices.get_time_difference(db_response[i].dataValues['updated_at']);
        db_response[i].dataValues['postTime'] = timeDifference;
    }
    if (db_response.length >= 0) {
        res.status(200).json({
            'data': db_response
        });
    }
    else {
        res.status(500).json({
            db_response
        });
    }
}

const get_filtered_posts = async (req, res) => {
    let type = req.body.type;
    type = type.toLowerCase();
    if (type === 'posted') {
        type = 'publish'
    }
    const db_response = await postServices.fetch_filter_posts(type);
    if (type === 'publish') {
        for (let i = 0; i < db_response.data.length; i++) {
            const created_at = db_response.data[i].dataValues['updated_at'];
            const created_at_est = moment(created_at).tz('America/New_York');
            const formattedDate = dateServices.modifyDateFormat(created_at_est);
            db_response.data[i].dataValues['publishTime'] = formattedDate;
        }
    }
    if (db_response.status === 'success') {
        res.status(200).json({
            'data': db_response.data
        });
    }
    else {
        res.status(500).json({
            'message': db_response.message
        });
    }
}

const get_filtered_posts_by_id = async (req, res) => {
    const { id } = req.params;
    let { type } = req.body;
    type = type.toLowerCase();
    if (type === 'posted') {
        type = 'publish'
    }
    const db_response = await postServices.fetch_filter_post_by_id(type, id);
    if (type === 'publish') {
        for (let i = 0; i < db_response.data.length; i++) {
            const created_at = db_response.data[i].dataValues['updated_at'];
            const created_at_est = moment(created_at).tz('America/New_York');
            const formattedDate = dateServices.modifyDateFormat(created_at_est);
            db_response.data[i].dataValues['publishTime'] = formattedDate;
        }
    }
    if (db_response.status === 'success') {
        res.status(200).json({
            'data': db_response.data
        });
    }
    else {
        res.status(500).json({
            'message': db_response.message
        });
    }
}

const delete_post = async (req, res) => {
    const { id } = req.params;
    const db_response = await postServices.delete_by_id(id);
    if (db_response.status === 'success') {
        if (db_response.data > 0) {
            res.status(200).json({
                'message': db_response.message,
                'status': 'success'
            });
        }
        else {
            res.status(200).json({
                'message': db_response.message,
                'status': 'failed'
            });
        }
    }
    else {
        res.status(500).json({
            'message': db_response.message,
            'status': 'failed'
        });
    }
}

const delete_multiple_posts = async (req, res) => {
    const IDs = req.body.IDs;
    const db_response = await postServices.deleteMultiplePosts(IDs);
    if (db_response.status === 'success') {
        res.status(200).json({
            message: db_response.message
        });
    }
    else {
        res.status(500).json({
            error_message: db_response.message
        });
    }
}

const get_posts_by_date_and_type = async (req, res) => {
    const { startDate, endDate } = req.body;
    const db_response = await postServices.getPostsByDateAndType(startDate, endDate);
    if (db_response.status === 'success') {
        res.status(200).json({
            'data': db_response.data
        });
    }
    else {
        res.status(500).json({
            error_message: db_response.message
        })
    }
}

postRouter.post('/add-post', middlewares.check_active, add_post)
postRouter.put('/update-post', middlewares.check_active, update_post)
postRouter.get('/get-all-posts-website-request/:website_name', get_posts_website_request)
postRouter.get('/get-post-website_request/:id', get_post_by_id)
postRouter.post('/get-filtered-posts', get_filtered_posts)
postRouter.post('/get-filtered-posts/:id', get_filtered_posts_by_id)
postRouter.delete('/delete-post/:id', middlewares.check_active, delete_post)
postRouter.delete('/delete-multiple-posts', middlewares.check_active, delete_multiple_posts)
postRouter.post('/get-posts-by-date-and-type', get_posts_by_date_and_type)

module.exports = postRouter;