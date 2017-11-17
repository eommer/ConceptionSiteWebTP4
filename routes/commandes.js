var express = require("express");
var router = express.Router();

var validator = require('validator');

var mongoose = require("mongoose");
mongoose.connect('mongodb://admin:1a2b3c@ds255265.mlab.com:55265/online-shop-db');

var Order = mongoose.model('Order');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

/** Récupère toutes les commandes présentes dans la base de données */
router.get("/", function(req, res) {
  Order.find(function(err, orders){
    console.log(orders);
    let lstOrders = [];
    if(orders.length > 0){
      lstOrders = orders;
    }
    res.status(200);
    res.json(lstOrders);
  })
});


module.exports = router;
