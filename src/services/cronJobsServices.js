const cronJob = require('node-cron')
const businessServices = require('../services/businessServices')

const job1 = cronJob.schedule('* * * * *', async () => {
    try {
    console.log('cronJob1 started execution');
    const idArray = [];
    const date = new Date('2023-12-21');
    const result = await businessServices.fetch_businesses_by_date(date);
    if (result.length > 0) {
        for(const obj of result) {
            idArray.push(obj['id']);
        }
        const permissions = {
            'websites': [{
                "website_name" : "post-your-biz4.vercel.app",
                "website_value" : false
            },
            {
                "website_name" : "post-your-biz1.vercel.app",
                "website_value" : false
            }
        ]
        }
        const result2 = await businessServices.update_websites_permission(idArray, permissions);
        if(result2[0]) {
            console.log('cronJob1 finished execution - Rows updated');
        }
        else {
            console.log(`cronJob1 finished execution, but there was an error: ${result2}`);
        }
    }
    else {
        console.log('cronJob1 finished execution - No results found');
    }
    } catch (error) {
        console.error('Error executing cronJob1:', error);
    }
});

const job3 = cronJob.schedule('*/3 * * * *', async () => {
    try {
        console.log('cronJob3 started execution');
        const idArray = [];
        const date = new Date('2024-12-21');
        const result = await businessServices.fetch_businesses_by_date(date);
        if (result.length > 0) {
            for(const obj of result) {
                idArray.push(obj['id']);
            }
            const permissions = {
                'websites': [{
                    "website_name" : "post-your-biz4.vercel.app",
                    "website_value" : false
                },
                {
                    "website_name" : "post-your-biz1.vercel.app",
                    "website_value" : false
                }
            ]
            }
            const result2 = await businessServices.update_websites_permission(idArray, permissions);
            if(result2[0]) {
                console.log('cronJob3 finished execution - Rows updated');
            }
            else {
                console.log(`cronJob3 finished execution, but there was an error: ${result2}`);
            }
        }
        else {
            console.log('cronJob3 finished execution - No results found');
        }
        } catch (error) {
            console.error('Error executing cronJob3:', error);
        }
});

const job5 = cronJob.schedule('*/5 * * * *', async () => {
    try {
        console.log('cronJob5 started execution');
        const idArray = [];
        const date = new Date('2025-12-21');
        const result = await businessServices.fetch_businesses_by_date(date);
        if (result.length > 0) {
            for(const obj of result) {
                idArray.push(obj['id']);
            }
            const permissions = {
                'websites': [{
                    "website_name" : "post-your-biz4.vercel.app",
                    "website_value" : false
                },
                {
                    "website_name" : "post-your-biz1.vercel.app",
                    "website_value" : false
                }
            ]
            }
            const result2 = await businessServices.update_websites_permission(idArray, permissions);
            if(result2[0]) {
                console.log('cronJob5 finished execution - Rows updated');
            }
            else {
                console.log(`cronJob5 finished execution, but there was an error: ${result2}`);
            }
        }
        else {
            console.log('cronJob5 finished execution - No results found');
        }
        } catch (error) {
            console.error('Error executing cronJob5:', error);
        }
});

const job0 = cronJob.schedule('0 0 * * *', async () => {
    try {
        console.log('cronJob0 started execution');
        const idArray = [];
        const date = new Date();
        const result = await businessServices.fetch_businesses_by_date(date);
        if (result.length > 0) {
            for(const obj of result) {
                idArray.push(obj['id']);
            }
            const permissions = {
                'websites': [{
                    "website_name" : "post-your-biz4.vercel.app",
                    "website_value" : false
                },
                {
                    "website_name" : "post-your-biz1.vercel.app",
                    "website_value" : false
                }
            ]
            }
            const result2 = await businessServices.update_websites_permission(idArray, permissions);
            console.log(result2);
            if(result2[0]) {
                console.log('cronJob5 finished execution - Rows updated');
            }
            else {
                console.log(`cronJob5 finished execution, but there was an error: ${result2}`);
            }
        }
        else {
            console.log('cronJob5 finished execution - No results found');
        }
        } catch (error) {
            console.error('Error executing cronJob5:', error);
        }
});

module.exports = {
    job1: job1,
    job3: job3,
    job5: job5
  }