const adminServices = require('../services/adminServices')
const tokenServices = require('../services/tokenServices')

const check_active = async (req, res, next) => {
    const token = req.header['Authorization'];
    console.log(token);
    const decoded_token = await tokenServices.verify_token(token);
    if (decoded_token['id']) {
        const id = decoded_token['id'];
        const result = await adminServices.fetch_one_with_id(id);
            if (result['active'] === true) {
                next();
            }
            else {
                return res.status(400).json({
                    'message': 'inactive'
                });
            }
    }
    else {
        return res.status(400).json({
            'message': 'invalid token'
        });
    }
}

module.exports = {
    check_active: check_active
}