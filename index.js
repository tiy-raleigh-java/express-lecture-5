const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const moment = require('moment');
const morgan = require('morgan');
const expressValidator = require('express-validator');
const foods = require('./food');
const fs = require('fs');
const app = express();

// tell express to use handlebars
app.engine('handlebars', exphbs());
app.set('views', './views');
app.set('view engine', 'handlebars');

// setup morgan for logging requests
// put this above other stuff in the hope that it will log static resources
app.use(morgan('dev'));

// tell express how to serve static files
app.use(express.static('public'));

//tell express to use the bodyParser middleware to parse form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// add express-validator middleware. This adds the checkBody() and presumably
// other methods to the req.
app.use(expressValidator());

// configure the webroot
app.get('/', function(req, res) {
  res.render('home', {
    formattedDate: moment().format('dddd, MMMM Do YYYY, h:mm:ss a'),
    foods: foods
  });
});

// show a particular food
app.get('/food/:index', function(req, res) {
  res.render('food', {
    foodItem: foods[req.params.index]
  });
});

// show a random number
app.get(
  // this means to listen for a request to http://..../randomNumber
  '/randomNumber/:max',
  // this is the code that gets run when the request comes in
  function(req, res) {
    // generate my random number
    let myRandomNumber = Math.round(Math.random() * req.params.max);

    // render the randomNumber template using the provided information
    res.render('randomNumber', {
      randomNumber: myRandomNumber
    });
  }
);

// this endpoint will show a form I can use to add foods
app.get('/foodForm', function(req, res) {
  res.render('foodForm');
});

// this handles the posted data from the form and creates a new food item
app.post('/addFood', function(req, res) {
  // get the food item details from the posted body data
  let foodItem = req.body;

  // validate the food item's data
  req.checkBody('name', 'Name is required').notEmpty();
  // make sure that the serving is provided.
  req.checkBody('serving', 'Serving is required').notEmpty();
  // make sure that the serving is provided.
  req.checkBody('serving', 'Serving is must uppercase').isUppercase();
  // get all errors from our validation that we just did as an array
  let errors = req.validationErrors();

  if (errors) {
    // there were errors, report them
    console.log(errors);

    res.render('foodForm', { errors: errors, foodItem: foodItem });
  } else {
    // there were no errors. save the food item

    // store the food item in our array of foods
    foods.push(foodItem);

    // now that I've added the food item to the array, redirect to the homepage
    res.redirect('/');
  }
});

// make express listen on port 3000
app.listen(3000);
