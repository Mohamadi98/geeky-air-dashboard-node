const adminServices = require('../services/adminServices')

const check_exist = async (req, res, next) => {
    const email = req.body.email;
    try {
        const result = await adminServices.fetch_one_with_email(email);
        
          if (result) {
            return res.status(400).json({
                'message': 'there is an admin with this email already'
            });
          }
          
          next();
              
          }
     catch (error) {
        res.status(500).json({
            'message': `there was an error: ${error}`
        })
    }

}

module.exports = {
  check_exist: check_exist
}