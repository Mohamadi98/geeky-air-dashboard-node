const express = require('express')
const app = express();
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const adminRouter = require('./controllers/adminController')
const adminServices = require('../src/services/adminServices')
const cors = require('cors');
const morgan = require('morgan')


dotenv.config();

app.use(
    morgan('combined', {
      skip: (req) => req.method === "OPTIONS",
    })
  );
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