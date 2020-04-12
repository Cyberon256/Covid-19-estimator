const fs = require('fs');
const lineBreak = require('os').EOL;

function responseTime(req, res, next){
  const startTime = process.hrtime();
  // const endPoint = req.baseUrl;

  res.on('finish', () => {
    let timeDiff = process.hrtime(startTime);
      
      // Convert everything to milliseconds
      // let actualTimeDiff = (timeDiff[0] * 1000) + (timeDiff[1] * 1e-6);
      // Convert everything to seconds
      let actualTimeDiff = timeDiff[0] + (timeDiff[1] * 1e-9);

      const timeStamp = (startTime[0] * 1e9) + startTime[1];
      const thisLog = timeStamp + '\t\t' + req.baseUrl + req.path + '\t\t' + 'done in ' + actualTimeDiff.toFixed(4) + ' seconds' + lineBreak;
      console.log("thisLog: " + thisLog);
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
};

module.exports = responseTime;