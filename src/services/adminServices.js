const admin_agent = require('../models/adminModel')
const dotenv = require('dotenv')
const hash_functions = require('../services/hashingServices')

dotenv.config();

const create = async (data) => {
    try {
        admin_agent.create(data);
        return true;
    } catch (error) {
        return `there was an error creating in the database ${error}`;
    }
}

const fetch_one_with_email = async (value) => {
    try {
        const result = await admin_agent.findOne({
            where: {
              email: value,
            },
          });
          return result;
    } catch (error) {
        return `there was an error fetching from database ${error}`
    }
}

const fetch_one_with_id = async (value) => {
    try {
        const result = await admin_agent.findOne({
            where: {
              id: value,
            },
            attributes: ['username', 'email', 'active', 'role', 'profile_image']
          });
          return result;
    } catch (error) {
        return `there was an error fetching from database ${error}`
    }
}

const update_admin_with_id = async (id, username, email, active, profile_image) => {
    try {
        if (profile_image === "") {
            const result = await admin_agent.update(
                {
                    'username': username,
                    'email': email,
                    'active': active,
                },
                {
                    where: { 'id': id }
                }
            )
            return result;
        }

        else {
            const result = await admin_agent.update(
                {
                    'username': username,
                    'email': email,
                    'active': active,
                    'profile_image': profile_image
                },
                {
                    where: { 'id': id }
                }
            )
            return result;
        }

    } catch (error) {
       return `there was an error updating the admin: ${error}`
    }
}

const fetch_all = async () => {
    try {
        const result = await admin_agent.findAll({
            where: {
              role: 'admin',
            },
            attributes: ['id', 'username', 'email', 'active', 'role', 'profile_image']
          });
          return result;
    } catch (error) {
        return `there was an error fetching from database ${error}`
    }
}

const super_admin_initialize = async () => {
    try {
        const hashed_password = await hash_functions.hash_password(process.env.SUPER_ADMIN_PASSWORD);
        const created = await admin_agent.findOrCreate({
            where: {
              email: process.env.SUPER_ADMIN_EMAIL
            },
            defaults: {
                email: process.env.SUPER_ADMIN_EMAIL,
                username: process.env.SUPER_ADMIN_USERNAME,
                password: hashed_password,
                role: 'superadmin',
                profile_image: ''
            }
          });
          if (created) {
            return 'super admin created';
          }

    } catch (error) {
        return `there was an error creating super admin ${error}`;
    }
}

const delete_one_with_id = async (id) => {
    try {
        const result = await admin_agent.destroy({
            where: {
              'id': id
            }
          });
          return result;
    } catch (error) {
        return `there was an error deleting admin: ${error}`
    }
}

module.exports = {
    create: create,
    super_admin_initialize: super_admin_initialize,
    fetch_all: fetch_all,
    fetch_one_with_email: fetch_one_with_email,
    fetch_one_with_id: fetch_one_with_id,
    update_admin_with_id: update_admin_with_id,
    delete_one_with_id: delete_one_with_id
}