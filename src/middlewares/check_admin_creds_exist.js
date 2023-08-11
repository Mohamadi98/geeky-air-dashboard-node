const admin_agent = require('../models/adminModel')

const check_exist = async (req, res, next) => {
    const email = req.body.email;
    const username = req.body.username;
    try {
        const result = await admin_agent.findOne({
            where: {
              email: email,
            },
          });
        
          if(result) {
            res.status(400).json({
                'message': 'there is an admin with this email already'
            });
          }

          else {
            const result = await admin_agent.findOne({
                where: {
                  username: username,
                },
              });

              if (result) {
                res.status(400).json({
                    'message': 'there is an admin with this username already'
                });
              }

              else {
                next();
              }
          }
    } catch (error) {
        res.status(500).json({
            'message': `there was an error: ${error}`
        })
    }

}

module.exports = check_exist;