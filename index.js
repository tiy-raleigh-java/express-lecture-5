const express = require('express');
const mustacheExpress = require('mustache-express');
const moment = require('moment');
const foods = require('./food');
const fs = require('fs');
const app = express();

// tell express to use mustache
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

// tell express how to serve static files
app.use(express.static('public'));

// configure the / path
app.get('/', function(req, res) {
  res.render('home', {
    formattedDate: moment().format('dddd, MMMM Do YYYY, h:mm:ss a'),
    foods: foods
  });
});

// show a particular food
app.get('/food/:id', function(req, res) {
  res.render('food', {
    foodItem: foods[req.params.id]
  });
});

// show a random number
app.get(
  // this means to listen for a request to http://..../randomNumber
  '/randomNumber',
  // this is the code that gets run when the request comes in
  function(req, res) {
    // generate my random number
    let myRandomNumber = Math.round(Math.random() * 100);

    res.send(`<doctype HTML>
      <html>
        <head>
        </head>
        <body>
          Your random number is ${myRandomNumber}
        </body>
      </html>`);
  }
);

// make express listen on port 3000
app.listen(3000);
