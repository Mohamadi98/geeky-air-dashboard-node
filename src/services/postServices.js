const business_agent = require('../models/businessModel')
const post_agent = require('../models/postModel')
const {Op, sequelize} = require('sequelize')

const create = async (data) => {
    try {
        const result = await post_agent.create(data);
        return result;
    } catch (error) {
        return `error creating a post: ${error}`
    }
}

module.exports = {
    create: create
}