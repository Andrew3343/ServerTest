// our dependencies
const express = require('express');
const app = express();
const router = express.Router();
const port = process.env.PORT;

const { Client } = require('pg');

var bodyParser = require("body-parser");
app.use(bodyParser.json());

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

const client2 = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

client2.connect((err) => {
  if (err) {
    console.error('connection error', err.stack);
  } else {
    console.log('client2 connected');
  }
});

// from top level path e.g. localhost:3000, this response will be sent
app.get('/', (request, response) => 
{
    client2.query('SELECT * FROM items', (err, res) => {
      if (err) throw err;
      response.send(res.rows);
//      client2.end();
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

//router.get('/stuff', (request, response) => {
//  var urlParts = url.parse(request.url, true);
//  var parameters = urlParts.query;
//  var myParam = parameters.myParam;
//  // e.g. myVenues = 12;
//  
//  var myResponse = `I multiplied the number you gave me (${myParam}) by 5 and got: ${myParam * 5}`;
//  
//  response.json({message: myResponse});
//});

router.post('/crashreports', (request, response) => {  
    var arr = request.body;
    console.log(arr);
    var descList = '';
    for (var i = 0; i < arr.length; i++)
    {
        if (i > 0)
        {
            descList = descList + ', '
        }
        descList = descList + arr[i].description.toString();
    }
    // \'report1\', \'report2\', \'report3\'
    var sql = 'INSERT INTO items (exceptionDescription) VALUES (unnest(ARRAY[' + descList + '])) RETURNING id';
    
    client2.query(sql, (err, result) =>
    {
        if (err) 
        {
            console.error(err);
            response.statusCode = 500;
            return response.json({
            errors: ['Failed to post reports']
            });
        }
        response.send(result.rows);
    });
});