const cronJob = require('node-cron')
const businessServices = require('../services/businessServices')
const dateServices = require('../services/dateServices')

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
    console.log('posts cron job started');
    const currentEstDateTime = dateServices.convert_from_utc_to_est();
    console.log(currentEstDateTime);
    console.log('cron job finished executing');
});

module.exports = {
    postsCronJob: postsCronJob
  }