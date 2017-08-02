const express = require('express');
const routes = express.Router();
const db = require('../db');

// show a random number
routes.get(
  // this means to listen for a request to http://..../randomNumber0
  '/',
  // this is the code that gets run when the request comes in
  function(req, res) {
    let restaurants = db.get().collection('restaurants');

    restaurants.find().toArray((err, restaurants) => {
      console.log(restaurants);
      // render the restaurants template using the restaurants
      res.render('restaurants', {
        restaurants
      });
    });
  }
);

module.exports = routes;
