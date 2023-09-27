const express = require('express')
const dotenv = require('dotenv')
const postServices = require('../services/postServices')
const dateServices = require('../services/dateServices')
const middlewares = require('../middlewares/check_if_admin_active')

dotenv.config();
const postRouter = express.Router();

const add_post = async (req, res) => {
    const request_data = req.body;
    if (request_data['type'] === 'publish') {

        const data = {
            business_id: request_data['business_id'],
            images: request_data['images'],
            video: request_data['video'],
            content: request_data['content'],
            status: 'published',
            type: request_data['type'],
            dates: [],
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
            expire_at: request_data['expire_at'],
            integrations: request_data['integrations'],
        }
        
    }
}

postRouter.post('/add-post', middlewares.check_active, add_post);

module.exports = postRouter;