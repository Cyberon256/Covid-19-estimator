const express = require('express');
//const cors = require('cors');

// require('dotenv').config();

const responseTime = require('./resTimeHandler');

// const responseTime = require('response-time');

const app = express();
const port = process.env.port || 5000;

//app.use(cors());
app.use(express.json());
app.use(responseTime());

const myRoute = require('./routes');
app.use('/api/v1/on-covid-19', myRoute);


// Start Server
app.listen(port, () => {
  console.log(`The Server is running on port: ${port}`);
});
