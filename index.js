// our dependencies
const express = require('express');
const app = express();
const router = express.Router();
const port = process.env.PORT;

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

client.connect((err) => {
  if (err) {
    console.error('connection error', err.stack);
  } else {
    console.log('connected');
    client.query('CREATE TABLE IF NOT EXISTS items(id SERIAL PRIMARY KEY, exceptionDescription VARCHAR(4000) not null)', (err, res) => {
        if (err) throw err
        console.log(res)
        client.end((err) => 
        {
            console.log('client has disconnected')
            if (err) {
            console.log('error during disconnection', err.stack)
            }
        })
    })
  }
});

// from top level path e.g. localhost:3000, this response will be sent
app.get('/', (request, response) => 
{
    client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
      if (err) throw err;
      response.send(res);
      client.end();
    });
    
});

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