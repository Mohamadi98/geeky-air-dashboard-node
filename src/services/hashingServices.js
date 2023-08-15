const dotenv = require('dotenv')
const bcrypt = require('bcrypt')

dotenv.config();

const secret_key = process.env.SECRET_KEY;
const salt_rounds = process.env.SALT_ROUNDS;

const hash_password = async (password) => {
    const salt = await bcrypt.genSalt(parseInt(salt_rounds));
    const hash = await bcrypt.hash(password + secret_key, salt);
    return hash;
}

const verify_hash = async (user_password, hashed_password) => {
    const result = await bcrypt.compare(user_password + secret_key, hashed_password);
    return result;
}

module.exports = {
    hash_password: hash_password,
    verify_hash: verify_hash
};