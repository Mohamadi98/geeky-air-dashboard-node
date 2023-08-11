const express = require('express')
const dotenv = require('dotenv')
const create = require('../services/adminServices')
const check_exist = require('../middlewares/check_admin_creds_exist')

dotenv.config();

const adminRouter = express.Router();

const add_admin = (req, res) => {
     const { username, email, password, active, profile_image } = req.body
     const data = {
          "username": username,
          "email": email,
          "password": password, 
          "role": 'admin',
          "active": active,
          "profile_image": profile_image
     }
     result = create(data);
     if (result) {
          res.status(200).json({
               'message': 'admin added successfuly!'
          });
     } 
     else{
          res.status(500).json({
               'message': result
          });
     }
}

adminRouter.post('/add-admin', check_exist, add_admin);

module.exports = adminRouter