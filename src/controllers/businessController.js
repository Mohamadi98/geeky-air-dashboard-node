const express = require('express')
const dotenv = require('dotenv')
const admin_active_check = require('../middlewares/check_if_admin_active')
const check_business_creds = require('../middlewares/check_business_creds')
const businessServices = require('../services/businessServices')
const transformArray = require('../services/convert_working_days_array')
const working_day_time_services = require('../services/working_day_time_services')
const dateServices = require('../services/dateServices')
const firebaseServices = require('../services/firebase_initialization')

dotenv.config();
const businessRouter = express.Router();

const add_business = async (req, res) => {
    const data = req.body;
    const business_name = req.body.name;
    working_days_arr = req.body.workingDays;
    delete data.workingDays;
    data['name'] = data['name'].toLowerCase();

    data['websites'] = [{
            "website_name" : "post-your-biz4.vercel.app",
            "website_value" : true
        },
        {
            "website_name" : "post-your-biz1.vercel.app",
            "website_value" : true
        }
    ]

    if (data['logo'] === "") {
        data['logo'] = 'https://via.placeholder.com/180x180&text=image1';
    }

    else {
        data['logo'] = await firebaseServices.upload_logo(data['logo'], business_name);
    }

    if (data['images'].length !== 0) {
        data['images'] = await firebaseServices.upload_business_images(data['images'], business_name);
    }

    if (data['video'] !== "") {
        data['video'] = await firebaseServices.upload_business_video(data['video'], business_name);
    }

    // data['expire_at'] = dateServices.add_to_date(1);
    data['expire_at'] = data['expire_at'].replace(/\//g, "-");
    const result = await businessServices.create(data);
    if (result.id) {
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
                'message': 'error creating working_day_time data'
            });
        }
    }
    else {
        res.status(500).json({
            'message': result
        });
    }
}

const get_all_businesses = async (req, res) => {
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

const get_business = async (req, res) => {
    const {id} = req.params;
    const result = await businessServices.fetch_business_by_id(id);
    if (result) {
        res.status(200).json({
            'data': result
        });
    }
    else {
        res.status(400).json({
            'message': 'No business with this id'
        });
    }
}

const delete_business = async (req, res) => {
    const { id } = req.params;
    const result = await businessServices.delete_business_by_id(id);
    if (result === 1) {
         res.status(200).json({
              'message': 'business deleted successfuly!'
         });
    }
    else {
         res.status(400).json({
              'message': 'there is no business associated with this id'
         });
    }
}

const update_business = async (req, res) => {
    const id = req.params.id
    const data = req.body;
    const business_name = req.body.name;
    working_days_arr = req.body.workingDays;
    delete data.workingDays;
    data['name'] = data['name'].toLowerCase();

    if (data['logo'] !== "") {
        data['logo'] = await firebaseServices.upload_logo(data['logo'], business_name);
    }

    if (data['images'].length !== 0) {
        data['images'] = await firebaseServices.upload_business_images(data['images'], business_name);
    }

    if (data['video'] !== "") {
        data['video'] = await firebaseServices.upload_business_video(data['video'], business_name);
    }

    const result = await businessServices.update_business_by_id(data, id);
    if (result[0] === 1) {
        converted_working_days = transformArray(working_days_arr, id);
        const result2 = await working_day_time_services.update(converted_working_days, id);
        if (result2) {
            res.status(200).json({
                'message': 'business updated successfuly!'
            });
        }
        else {
            res.status(500).json({
                'message': `error creating working_day_time data: ${result2}`
            });
        }
    }
    else {
        res.status(400).json({
            'message': 'NO business associated with this id'
        });
    }
}

const get_businesses_per_website_request = async (req, res) => {
    const { website_name } = req.params;
    const result = await businessServices.fetch_business_via_website_request(website_name);
    if (result) {
        res.status(200).json(result)
    }
    else {
        res.status(400).json(result)
    }
}

const filter_businesses = async (req, res) => {
    const {website_name} = req.params;
    const data = req.body;
    const result = await businessServices.filter_businesses_website_request(website_name, data);
    if (result) {
        res.status(200).json(result);
    }
    else {
        res.status(500).json(result);
    }
}

const Mohamadi = async (req, res) => {
    const image = req.body.image;
    const response = await firebaseServices.uploadBase64Image(image);
    res.status(200).json({
        response
    });
}

businessRouter.post('/add-business', admin_active_check.check_active, check_business_creds, add_business)
businessRouter.get('/get-businesses', get_all_businesses)
businessRouter.get('/get-business/:id', get_business)
businessRouter.put('/update-business/:id', admin_active_check.check_active, update_business)
businessRouter.delete('/delete-business/:id', admin_active_check.check_active, delete_business)
businessRouter.get('/get-businesses-website-request/:website_name', get_businesses_per_website_request)
businessRouter.post('/filter-business-website-request/:website_name', filter_businesses)
businessRouter.post('/Mohamadi', Mohamadi)

module.exports = businessRouter