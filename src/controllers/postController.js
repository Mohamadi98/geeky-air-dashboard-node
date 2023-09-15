const express = require('express')
const dotenv = require('dotenv')
const postServices = require('../services/postServices')

dotenv.config();
const postRouter = express.Router();

const add_post = async (req, res) => {
    const data = req.body;
    data['scheduled_at'] = data['scheduled_at'].toISOstring
    const result = await postServices.create(data);
    console.log(result);
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