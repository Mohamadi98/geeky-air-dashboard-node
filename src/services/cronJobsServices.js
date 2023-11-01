const cronJob = require('node-cron')
const businessServices = require('../services/businessServices')
const postServices = require('../services/postServices')
const dateServices = require('../services/dateServices')
const postAgent = require('../models/postModel')
const {Op} = require('sequelize')
const moment = require('moment-timezone')

// const job0 = cronJob.schedule('0 0 * * *', async () => {
//     try {
//         console.log('cronJob0 started execution');
//         const idArray = [];
//         const date = new Date();
//         const result = await businessServices.fetch_businesses_by_date(date);
//         if (result.length > 0) {
//             for(const obj of result) {
//                 idArray.push(obj['id']);
//             }
//             const permissions = {
//                 'websites': [{
//                     "website_name" : "post-your-biz4.vercel.app",
//                     "website_value" : false
//                 },
//                 {
//                     "website_name" : "post-your-biz1.vercel.app",
//                     "website_value" : false
//                 }
//             ]
//             }
//             const result2 = await businessServices.update_websites_permission(idArray, permissions);
//             console.log(result2);
//             if(result2[0]) {
//                 console.log('cronJob0 finished execution - Rows updated');
//             }
//             else {
//                 console.log(`cronJob0 finished execution, but there was an error: ${result2}`);
//             }
//         }
//         else {
//             console.log('cronJob0 finished execution - No results found');
//         }
//         } catch (error) {
//             console.error('Error executing cronJob0:', error);
//         }
// });
const postsCronJob = cronJob.schedule('* * * * *', async () => {
    console.log('Posts Cron Job Started');
    const currentUtcDateTime = moment().tz('UTC');
    const formattedUtcDate = currentUtcDateTime.format('YYYY-MM-DDTHH:mm:ssZ');
    console.log(formattedUtcDate);
    const posts = await postServices.seacrh_by_date(formattedUtcDate);

    if (posts.length === 0) {
        console.log('Cron Job Finished Executing - No Results Found');
    }

    else {
        for (const post of posts) {
            if (post.dataValues['type'] === 'scheduled') {
                const post_data = {
                    status: 'published',
                    type: 'publish'
                }
                const post_id = post.dataValues['id'];
                const db_response = await postServices.update_post(post_data, post_id);
                if (db_response > 0) {
                    console.log(`row with id:${post_id} status updated to 'published'`);
                }
                else {
                    console.log(`issue updating row with id:${post_id}, error received: ${db_response}`);
                }
            } else if (post.dataValues['type'] === 'recurring') {
                const post_data = {
                    business_id: post.dataValues['business_id'],
                    images: post.dataValues['images'],
                    video: post.dataValues['video'],
                    content: post.dataValues['content'],
                    status: 'published',
                    type: 'publish',
                    italic: post.dataValues['italic'],
                    bold: post.dataValues['bold'],
                    title: post.dataValues['title'],
                    websites: post.dataValues['websites']
                }
                const db_response = await postServices.create(post_data)
                if(db_response.id) {
                    console.log(`row with id:${db_response.id} created`);
                } else {
                    console.log(`issue creating row, error received: ${db_response}`)
                }

            }
        }
    }
    console.log('Cron Job Finished Executing');
});

// const expireSoonCronJob = cronJob.schedule('33 19 * * *', async () => {
//     console.log('Expire Soon Cron Job Started');
//     try {
//         const posts = await postAgent.findAll({
//             where: {
//                 type: 'recurring',
//                 expired: {
//                     [Op.not]: true
//                 }
//             }
//         });
//         if (posts.length > 0) {
//             for (const post of posts) {
//                 if (post.dataValues['days_until_expiration'] === 0) {
//                     post.expired = true;
//                     await post.save();
//                     console.log(`post with id: ${post.id} has expired`);
//                 }
//                 else if (post.dataValues['days_until_expiration'] > 0) {
//                     post.days_until_expiration -= 1;
//                     await post.save();
//                     console.log(`post with id: ${post.id} expiry reduced by a day`);
//                 }
//                 else {
//                     console.log('null value for days_until_expiration field');
//                 }
//             }
//         }
//         else {
//             console.log('Cron Job Finished - No Results Found');
//         }
//     } catch (error) {
//         console.error('Error executing cronJob0:', error);
//     }
//     console.log('Expire Soon Cron JOb Finished Executing');
// }, {
//     timezone: 'Africa/Cairo'
// });

module.exports = {
    postsCronJob: postsCronJob,
    expireSoonCronJob: expireSoonCronJob
  }