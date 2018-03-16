// our dependencies
const express = require('express');
const app = express();
const router = express.Router();
const port = process.env.PORT;

// from top level path e.g. localhost:3000, this response will be sent
app.get('/', (request, response) => response.send('Hello World'));

// all routes prefixed with /api
app.use('/api', router);

// using router.get() to prefix our path
// url: http://localhost:3000/api/
router.get('/', (request, response) => {
  response.json({message: 'Hello, welcome to my server'});
});

// set the server to listen on port 3000
app.listen(port, () => console.log(`Listening on port ${port}`));

const url = require('url');

router.get('/stuff', (request, response) => {
  var urlParts = url.parse(request.url, true);
  var parameters = urlParts.query;
  var myParam = parameters.myParam;
  // e.g. myVenues = 12;
  
  var myResponse = `I multiplied the number you gave me (${myParam}) by 5 and got: ${myParam * 5}`;
  
  response.json({message: myResponse});
});