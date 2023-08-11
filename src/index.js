const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const adminRouter = require('./controllers/adminController')


dotenv.config();
const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('server started');
});
app.use(adminRouter)

app.listen(5000, () => {
    console.log('server running on port 5000');
});

module.exports = app