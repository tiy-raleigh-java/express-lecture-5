const express = require('express');
const routes = express.Router();
const db = require('../db');

// show all
routes.get(
  // this means to listen for a request to http://..../randomNumber0
  '/',
  // this is the code that gets run when the request comes in
  function(req, res) {
    let collection = db.get().collection('restaurants');

    collection.find().toArray((err, restaurants) => {
      // render the restaurants template using the restaurants
      res.render('restaurants', {
        restaurants
      });
    });
  }
);

// show ones that match the url
routes.get(
  '/:pattern',
  // this is the code that gets run when the request comes in
  function(req, res) {
    let collection = db.get().collection('restaurants');

    collection.find({ name: new RegExp(req.params.pattern, 'i') }).toArray((err, restaurants) => {
      // render the restaurants template using the restaurants
      res.render('restaurants', {
        restaurants
      });
    });
  }
);

module.exports = routes;
