const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const adminRouter = require('./controllers/adminController')
const adminServices = require('../src/services/adminServices')


dotenv.config();
const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('server started');
});
app.use(adminRouter)

adminServices.super_admin_initialize();

app.listen(5000, () => {
    console.log('server running on port 5000');
});

module.exports = app