const express = require('express')
const dotenv = require('dotenv')

dotenv.config();

const adminRouter = express.Router();

const index = (req, res) => {
     res.send('admin route running')
}

adminRouter.get('/admin', index);
module.exports = adminRouter