const business_agent = require('../models/businessModel')
const post_agent = require('../models/postModel')
const {Op, sequelize} = require('sequelize')

const create = async (data) => {
    try {
        console.log('we are at the create a post function');
        console.log(data);
        const result = await post_agent.create(data);
        console.log('we are in post services');
        console.log(result);
        return result;
    } catch (error) {
        return `error creating a post: ${error}`
    }
}

module.exports = {
    create: create
}