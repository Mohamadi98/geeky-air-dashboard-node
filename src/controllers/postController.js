const express = require('express')
const dotenv = require('dotenv')
const postServices = require('../services/postServices')
const dateServices = require('../services/dateServices')
const middlewares = require('../middlewares/check_if_admin_active')
const S3Services = require('../services/awsS3Services')


dotenv.config();
const postRouter = express.Router();

const add_post = async (req, res) => {
    const request_data = req.body;
    if (request_data['type'] === 'publish') {
        if (request_data['images'].length > 0) {
            request_data['images'] = await S3Services.upload_post_images(request_data['business_id'], request_data['images']);
        }
        if (request_data['video'] !== "") {
            request_data['video'] = await S3Services.upload_post_video(request_data['video'], request_data['business_id']);
        }
        const data = {
            business_id: request_data['business_id'],
            images: request_data['images'],
            video: request_data['video'],
            content: request_data['content'],
            status: 'published',
            type: request_data['type'],
            italic: request_data['italic'],
            bold: request_data['bold'],
            websites: [{
                "website_name" : "post-your-biz4.vercel.app",
                "website_value" : true
            },
            {
                "website_name" : "post-your-biz1.vercel.app",
                "website_value" : true
            },
            {
                "website_name" : "post-your-biz2.vercel.app",
                "website_value" : true
            },
        ],
            integrations: request_data['integrations'],
        }
        const db_response = await postServices.create(data);
        if (db_response.id) {
            res.status(200).json({
                'message': 'post created successfuly!'
            });
        }

    }
}

postRouter.post('/add-post', middlewares.check_active, add_post);

module.exports = postRouter;