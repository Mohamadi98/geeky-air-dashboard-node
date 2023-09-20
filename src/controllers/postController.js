const express = require('express')
const dotenv = require('dotenv')
const postServices = require('../services/postServices')
const dateServices = require('../services/dateServices')

dotenv.config();
const postRouter = express.Router();

const add_post = async (req, res) => {
    const data = req.body;
    console.log(data['scheduled_at']);
    data['scheduled_at'] = dateServices.convert_date_timezone(data['scheduled_at']);
    console.log(data['scheduled_at']);
    const result = await postServices.create(data);
    if (result.id) {
        res.status(200).json({
            'message': 'post created successfuly!'
        });
    }
    else {
        res.status(400).json({
            'error message': result
        });
    }
}

postRouter.post('/add-post', add_post);

module.exports = postRouter;