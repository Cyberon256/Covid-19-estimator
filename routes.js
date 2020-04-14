const router = require('express').Router();
const xml2js = require('xml2js')
const estimator = require('./estimator');
const fs = require('fs');


router.post('/', (req, res) => {
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
    res.type('Content-Type', 'text/xml');
    res.status(200).send(myEstimate);    
  } else {
    // json
    res.status(200).send(estimator(req.body));
  }
});

router.get('/logs', (req, res) => {
  // Read server.log
  fs.readFile('server.log', 'utf8', (err, file) => {
    if (err) {
      // show the error
    } else {
      // return contents of the file
      res.type('content-type', 'text/plain');
      res.status(200).send(file);
    }
  });
});

module.exports = router;
