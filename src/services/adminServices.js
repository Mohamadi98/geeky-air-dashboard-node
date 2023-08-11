const admin_agent = require('../models/adminModel')

const create = async (data) => {
    try {
        admin_agent.create(data);
        return true;
    } catch (error) {
        return error;
    }
}

module.exports = create;