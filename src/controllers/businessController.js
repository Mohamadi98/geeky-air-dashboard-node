const express = require('express')
const dotenv = require('dotenv')
const admin_active_check = require('../middlewares/check_if_admin_active')
const check_business_creds = require('../middlewares/check_business_creds')
const businessServices = require('../services/businessServices')
const transformArray = require('../services/convert_working_days_array')
const working_day_time_services = require('../services/working_day_time_services')
const dateServices = require('../services/dateServices')

dotenv.config();
const businessRouter = express.Router();

const add_business = async (req, res) => {
    const data = req.body;
    working_days_arr = req.body.workingDays;
    delete data.token;
    delete data.workingDays;
    if (data['logo'] === "") {
        data['logo'] = 'https://via.placeholder.com/180x180&text=image1';
    }
    data['expire_at'] = dateServices.add_to_date(1);
    const result = await businessServices.create(data);
    if (result['id']) {
        business_id = result['id'];
        converted_working_days = transformArray(working_days_arr, business_id);
        const result2 = await working_day_time_services.create(converted_working_days)
        if (result2) {
            res.status(200).json({
                'message': 'business added successfuly!'
            });
        }
        else {
            res.status(500).json({
                'message': result2
            });
        }
    }
    else {
        res.status(500).json({
            'message': result2
        });
    }
}

const get_businesses = async (req, res) => {
    const result = await businessServices.show_all_businesses();
    if (result) {
        res.status(200).json({
            result
        });
    }
    else {
        res.status(400).json({
            'message': 'No businesses found'
        });
    }
}

const Hamdy = async (req, res) => {
    
}

businessRouter.post('/add-business', admin_active_check.check_active, check_business_creds, add_business);
businessRouter.get('/get-businesses', get_businesses);
businessRouter.post('/hamdy', Hamdy);

module.exports = businessRouter