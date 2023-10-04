const express = require('express')
const dotenv = require('dotenv')
const postServices = require('../services/postServices')
const dateServices = require('../services/dateServices')
const middlewares = require('../middlewares/check_if_admin_active')
const S3Services = require('../services/awsS3Services')
const recurringServices = require('../services/createRecurringDates')


dotenv.config();
const postRouter = express.Router();

const add_post = async (req, res) => {
    const request_data = req.body;
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
            websites: [{
                "website_name": "post-your-biz4.vercel.app",
                "website_value": true
            },
            {
                "website_name": "post-your-biz1.vercel.app",
                "website_value": true
            },
            {
                "website_name": "post-your-biz2.vercel.app",
                "website_value": true
            }],
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
        const time = request_data['time'];
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
            websites: [{
                "website_name": "post-your-biz4.vercel.app",
                "website_value": true
            },
            {
                "website_name": "post-your-biz1.vercel.app",
                "website_value": true
            },
            {
                "website_name": "post-your-biz2.vercel.app",
                "website_value": true
            }],
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
                    request_data['time']);
            const endingDate = dateServices
                .create_est_with_date_and_time(request_data['end_date'],
                request_data['time']);
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
                expire_at: endingDate,
                websites: [{
                    "website_name": "post-your-biz4.vercel.app",
                    "website_value": true
                },
                {
                    "website_name": "post-your-biz1.vercel.app",
                    "website_value": true
                },
                {
                    "website_name": "post-your-biz2.vercel.app",
                    "website_value": true
                }],
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
                    request_data['time']);
            const time = request_data['time']
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
                expire_at: endingDate,
                websites: [{
                    "website_name": "post-your-biz4.vercel.app",
                    "website_value": true
                },
                {
                    "website_name": "post-your-biz1.vercel.app",
                    "website_value": true
                },
                {
                    "website_name": "post-your-biz2.vercel.app",
                    "website_value": true
                }],
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
            const time = request_data['time'];
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
                dates: dates,
                websites: [{
                    "website_name": "post-your-biz4.vercel.app",
                    "website_value": true
                },
                {
                    "website_name": "post-your-biz1.vercel.app",
                    "website_value": true
                },
                {
                    "website_name": "post-your-biz2.vercel.app",
                    "website_value": true
                }],
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
    else {
        res.status(400).json({
            'message': 'invalid post type'
        });
    }
}

const get_posts = async (req, res) => {
    const db_response = await postServices.show_all_posts();
    for (let i = 0; i < db_response.length; i++) {
        db_response[i].dataValues['postTime'] = dateServices.get_time_difference(db_response[i].dataValues['updated_at']);
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

const get_posts_website_request = async (req, res) => {
    const {website_name} = req.params;
    const db_response = await postServices.show_all_posts_website_request(website_name);
    for (let i = 0; i < db_response.length; i++) {
        db_response[i].dataValues['postTime'] = dateServices.get_time_difference(db_response[i].dataValues['updated_at']);
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

postRouter.post('/add-post', middlewares.check_active, add_post);
postRouter.get('/get-all-posts', get_posts);
postRouter.get('/get-all-posts-website-request:website_name', get_posts_website_request)

module.exports = postRouter;