const adminServices = require('../services/adminServices')

const check_super_admin = async (req, res, next) => {
    const {id} = req.params;
    try {
        const result = await adminServices.fetch_one_with_id(id);
        
        if (result) {  
            if (result['role'] === 'superadmin') {
                return res.status(400).json({
                    'message': 'No admin associated with this id'
                });
            }
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
  check_super_admin: check_super_admin
}