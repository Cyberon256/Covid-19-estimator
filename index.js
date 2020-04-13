const express = require('express');
const fs = require('fs');
const lineBreak = require('os').EOL;
//const cors = require('cors');
// require('dotenv').config();


const app = express();
const port = process.env.port || 5000;

//app.use(cors());
app.use(express.json());
//app.use(responseTime());

app.use((req, res, next) => {
  const startTime = process.hrtime();

  res.on('finish', () => {
    let timeDiff = process.hrtime(startTime);
      
      // Convert everything to milliseconds
      // let actualTimeDiff = (timeDiff[0] * 1000) + (timeDiff[1] * 1e-6);
      // Convert everything to seconds
      let actualTimeDiff = timeDiff[0] + (timeDiff[1] * 1e-9);

      const timeStamp = (startTime[0] * 1e9) + startTime[1];
      const thisLog = timeStamp + '\t\t' + req.baseUrl + req.path + '\t\t' + 'done in ' + actualTimeDiff.toFixed(4) + ' seconds' + lineBreak;
      // Write to server.log
      fs.appendFile('server.log', thisLog, (err) => {
        if (err) {
          // return error
        } else {
          // return success
        }
      });
  }); 

  next();
});

const myRoute = require('./routes');
app.use('/api/v1/on-covid-19', myRoute);


// Start Server
app.listen(port, () => {
  console.log(`The Server is running on port: ${port}`);
});
