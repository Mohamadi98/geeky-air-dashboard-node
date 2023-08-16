const express = require('express')
const dotenv = require('dotenv')
const adminServices = require('../services/adminServices')
const adminMiddlewares = require('../middlewares/check_admin_creds_exist')
const hash_functions = require('../services/hashingServices')
const tokenServices = require('../services/tokenServices')

dotenv.config();

const adminRouter = express.Router();

const add_admin = async (req, res) => {
     const { username, email, password, active } = req.body;
     let profile_image = req.body.profile_image;
     console.log(profile_image);
     if (profile_image === "") {
          profile_image = 'https://www.drivetest.de/wp-content/uploads/2019/08/drivetest-avatar-m.png'
     }
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

const get_all_admins = async (req, res) => {
     try {
          const result = await adminServices.fetch_all();
          res.status(200).json(result);
     } catch (error) {
          return `error fetching admins: ${error}`
     }
}

const admin_login = async (req, res) => {
     const { email, password } = req.body;
     const result = await adminServices.fetch_one_with_email(email);
     if (result) {
          const admin_password = result['password'];
          const verify_password = await hash_functions.verify_hash(password, admin_password);
          if (verify_password) {
               const token = await tokenServices.generate_token(result['id'], email);
               if (result['role'] === 'superadmin') {
                    res.status(200).json({
                         'message': 'superadmin user',
                         'token': token
                    });
               }
               else{
                    res.status(200).json({
                         'message': 'admin user',
                         'token': token
                    });
               }
          }
          else{
               res.status(400).json({
                    'message': 'invalid email or password'
               });
          }
     }
     else{
          res.status(400).json({
               'message': 'invalid email'
          })
     }
}

adminRouter.post('/add-admin', adminMiddlewares.check_exist, add_admin);
adminRouter.get('/get-all-admins', get_all_admins)
adminRouter.post('/admin-login', admin_login)

module.exports = adminRouter