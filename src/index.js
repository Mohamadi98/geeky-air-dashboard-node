const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const adminRouter = require('./controllers/adminController')
const adminServices = require('../src/services/adminServices')
const cors = require('cors');


dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = process.env.PORT;

app.get('/', (req, res) => {
    res.send('server started');
});
app.use(adminRouter)

adminServices.super_admin_initialize();

app.listen(PORT, () => {
    console.log(`Server running on port = ${PORT}`);
});

module.exports = app