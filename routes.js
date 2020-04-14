const router = require('express').Router();
const xml2js = require('xml2js')
const estimator = require('./estimator');
const fs = require('fs');
const lineBreak = require('os').EOL;

router.post('/', (req, res) => {
  res.type('application/json');
  res.status(200).send(estimator(req.body)); 
});

router.post('/:type', (req, res) => {   
  if (req.params.type === 'xml') {   
    // convert estimator(req.body) to xml
    const builder = new xml2js.Builder({
      rootName: 'estimate',
      trim: true
    });
    const myEstimate = builder.buildObject(estimator(req.body));
    res.type('application/xml');
    res.status(200).send(myEstimate);    
  } else {
    // json
    res.type('application/json');
    res.status(200).send(estimator(req.body));
  }
});

router.get('/logs', (req, res) => {
  const startTime = process.hrtime();
  let serverLogs;

  // Read server.log
  fs.readFile('logs.txt', 'utf8', (err, file) => {

    let timeDiff = process.hrtime(startTime);
      
      // Convert everything to milliseconds
      let actualTimeDiff = (timeDiff[0] * 1000) + (timeDiff[1] * 1e-6);

      function numb(n) {
        return n < 10 ? "0" + n.toFixed(0): "" + n.toFixed(0);
      }
      actualTimeDiff = numb(actualTimeDiff);


    if (err) {
      // console.log(err)
      serverLogs = req.method + '\t\t' + req.baseUrl + req.path + '\t\t' + res.statusCode + '\t\t' + actualTimeDiff + 'ms';
    } else {
      // return contents of the file
      serverLogs = file + lineBreak + req.method + '\t\t' + req.baseUrl + req.path + '\t\t' + res.statusCode + '\t\t' + actualTimeDiff + 'ms';
      
    }
    // Send response
    console.log(serverLogs);
      res.setHeader('Content-Type', 'text/plain');

      res.status(200).send(serverLogs);

  });

  const timeHandler = (tStart) => {
    //const startTime = process.hrtime();
    startTime = tStart;

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
  }
});

module.exports = router;
