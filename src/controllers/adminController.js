const express = require('express')
const dotenv = require('dotenv')
const adminServices = require('../services/adminServices')
const adminMiddlewares = require('../middlewares/check_admin_creds_exist')
const hash_functions = require('../services/hashingServices')

dotenv.config();

const adminRouter = express.Router();

const add_admin = async (req, res) => {
     const { username, email, password, active, profile_image } = req.body;
     const hashed_password = await hash_functions.hash_password(password)
     const data = {
          username: username,
          email: email,
          password: hashed_password, 
          role: 'admin',
          active: active,
          profile_image: profile_image
     }
     result = adminServices.create(data);
     if (result) {
          res.status(200).json({
               'message': 'admin added successfuly!'
          });
     } 
     else {
          res.status(500).json({
               'message': result
          });
     }
}

adminRouter.post('/add-admin', adminMiddlewares.check_exist, add_admin);

module.exports = adminRouter