const express = require('express')
const dotenv = require('dotenv')
const admin_agent = require('../models/adminModel')

dotenv.config();

const adminRouter = express.Router();

const create = async (req, res) => {
     const { username, email, password, role, active, profile_image } = req.body
     console.log(email);
     const data = {
          "username": username,
          "email": email,
          "password": password, 
          "role": role,
          "active": active,
          "profile_image": profile_image
     }
     const new_admin = await admin_agent.create(data);
     res.json(new_admin);
}

adminRouter.post('/admin', create);

module.exports = adminRouter