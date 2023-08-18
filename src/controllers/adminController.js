const express = require('express')
const dotenv = require('dotenv')
const adminServices = require('../services/adminServices')
const adminMiddlewares = require('../middlewares/check_admin_creds_exist')
const check_super_admin = require('../middlewares/check_if_superadmin')
const hash_functions = require('../services/hashingServices')
const tokenServices = require('../services/tokenServices')

dotenv.config();

const adminRouter = express.Router();

const add_admin = async (req, res) => {
     const { username, email, password } = req.body;
     let profile_image = req.body.profile_image;
     let active = req.body.active;

     if (active === 'active') {
          active = true;
     }
     else {
          active = false;
     }

     if (profile_image === "") {
          profile_image = 'https://www.pngkit.com/png/detail/853-8533526_testpersion1-avatar-for-profile.png'
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
          let result = await adminServices.fetch_all();

          for (let i = 0; i < result.length; i++) {
               if (result[i]['active'] === true) {
                    result[i]['active'] = 'active';
               }

               else {
                    result[i]['active'] = 'inactive';
               }
          }

          res.status(200).json(result);
     } catch (error) {
          return `error fetching admins: ${error}`
     }
}

const get_admin = async (req, res) => {
     try {
          const { id } = req.params;
          const result = await adminServices.fetch_one_with_id(id);
          if (result) {
               res.status(200).json(result);
          }
          else {
               res.status(400).json({
                    'message': 'No admin associated with this id'
               });
          }
     } catch (error) {
          return `there was an error fetching the data: ${error}`
     }
}

const edit_admin = async (req, res) => {
     try {
          const {id} = req.params
          const { username, email } = req.body;
          let profile_image = req.body.profile_image;
          if (profile_image === "") {
               profile_image = 'https://www.pngkit.com/png/detail/853-8533526_testpersion1-avatar-for-profile.png';
          }
          let active = req.body.active;
          if (active === 'active') {
               active = true;
          }
          else {
               active = false;
          }
          const result = adminServices.update_admin_with_id(id, username, email, active, profile_image)
          if (result[0] === 1) {
               res.status(200).json({
                    'message': 'admin updated successfuly!'
               });
          }
          else {
               res.status(400).json({
                    'message': 'No admin associated with this id'
               });
          }

     } catch (error) {
          return `there was an error editing the data: ${error}`
     }
}

const admin_login = async (req, res) => {
     const { email, password } = req.body;
     const result = await adminServices.fetch_one_with_email(email);
     if (result) {
          const admin_password = result['password'];
          const check_admin_active = result['active'];
          if (check_admin_active === false) {
               return res.status(400).json({
                    'message': 'inactive admin'
               });
          }
          const verify_password = await hash_functions.verify_hash(password, admin_password);
          if (verify_password) {
               const token = await tokenServices.generate_token(result['id'], email);
               if (result['role'] === 'superadmin') {
                    res.status(200).json({
                         'message': 'superadmin user',
                         'token': token
                    });
               }
               else {
                    res.status(200).json({
                         'message': 'admin user',
                         'token': token
                    });
               }
          }
          else {
               res.status(400).json({
                    'message': 'invalid email or password'
               });
          }
     }
     else {
          res.status(400).json({
               'message': 'invalid email'
          })
     }
}

adminRouter.post('/add-admin', adminMiddlewares.check_exist, add_admin);
adminRouter.get('/get-all-admins', get_all_admins)
adminRouter.post('/admin-login', admin_login)
adminRouter.get('/get-admin/:id', check_super_admin.check_super_admin, get_admin)
adminRouter.post('/edit-admin/:id', check_super_admin.check_super_admin, edit_admin)

module.exports = adminRouter