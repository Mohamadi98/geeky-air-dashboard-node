const JWT = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config();

const generate_token = async (id, email) => {
    try {
        const payload = {
            'id': id,
            'email': email
        };
        const secret_key = process.env.SECRET_KEY;
        
        const token = await JWT.sign(payload, secret_key);
        return token;

    } catch (error) {
        return `error generating the token: ${error}`;
    }
}

const verify_token = async (token) => {
    try {
        const secretKey = process.env.SECRET_KEY;
        const decoded = await JWT.verify(token, secretKey);
        return decoded;

      } catch (error) {
        if (error instanceof JWT.TokenExpiredError) {
          return 'token has expired';
          
        } else if (error instanceof JWT.JsonWebTokenError) {
          return 'invalid token';

        } else {
          return `error verifying the token: ${error}`;
        }
    }
}

module.exports = {
    generate_token: generate_token,
    verify_token: verify_token
}