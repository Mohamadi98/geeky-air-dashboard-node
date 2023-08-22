const businessServices = require('../services/businessServices')

const check_creds = async (req, res, next) => {
    const { email, phone_no } = req.body;
    const result = await businessServices.fetch_business_with_email_phone(email, phone_no);
    if (result['id']) {
        return res.status(400).json({
            'message': 'there is a registered business with the same email or phone number'
        });
    }
    else {
        next();
    }
}

module.exports = check_creds