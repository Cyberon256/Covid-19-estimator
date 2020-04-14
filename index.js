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

app.get('/favicon.ico', (req, res) => res.status(204));  // Disable /favicon.ico
app.get('/', (req, res) => res.status(204));  // Disable /

app.use((req, res, next) => {
  const startTime = process.hrtime();

    res.on('finish', () => {
    let timeDiff = process.hrtime(startTime);
      
      // Convert everything to milliseconds
      let actualTimeDiff = (timeDiff[0] * 1000) + (timeDiff[1] * 1e-6);

      function numb(n) {
        return n < 10 ? "0" + n.toFixed(0): "" + n.toFixed(0);
      }
      actualTimeDiff = numb(actualTimeDiff);
      
      // const timeStamp = (startTime[0] * 1e9) + startTime[1];

      fs.access('logs.txt', (err) => {
        if (err) {
          // console.log('logs.txt does not exist!');
          const createLogs = req.method + '\t\t' + req.baseUrl + req.path + '\t\t' + res.statusCode + '\t\t' + actualTimeDiff + 'ms';
          fs.writeFile('logs.txt', createLogs, (err) => {
            if (err) {
              console.log(err);
            } else {
              //console.log('Success!');
            }
          });
        } else {
          //console.log('Server.log exists!');
          const addToLogs = lineBreak + req.method + '\t\t' + req.baseUrl + req.path + '\t\t' + res.statusCode + '\t\t' + actualTimeDiff + 'ms'; 
          fs.appendFile('logs.txt', addToLogs, (err) => {
          if (err) throw err;
          console.log('Saved!');
        });
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
