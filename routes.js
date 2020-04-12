const router = require('express').Router();
const xml2js = require('xml2js')
const estimator = require('./estimator');
const fs = require('fs');

let startTime = null
let endTime = null

router.post('/', (req, res) => {
  res.send(estimator(req.body));
});

router.post('/:type', (req, res) => {
  let myEstimate = estimator(req.body)
    
  if (req.params.type === 'xml') {
    const builder = new xml2js.Builder({
      rootName: 'estimate',
      trim: true
    });
    myEstimate = builder.buildObject(myEstimate);
    res.send(myEstimate);
  } else {
    res.send(myEstimate);
  }
});

router.get('/logs', (req, res) => {
  // Read
  fs.readFile('server.log', 'utf8', (err, file) => {
    if (err) {
      // show the error
    } else {
      // return contents of the file
      res.send(file);
    }
  });
});

module.exports = router;
