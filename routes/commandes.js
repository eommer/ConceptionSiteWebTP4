var express = require("express");
var router = express.Router();

var validator = require('validator');

var mongoose = require("mongoose");
mongoose.connect('mongodb://admin:1a2b3c@ds255265.mlab.com:55265/online-shop-db');

var Order = mongoose.model('Order');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

/** Récupère toutes les commandes présentes dans la base de données */
router.get("/", function (req, res) {
  Order.find(function (err, orders) {
    if (err) throw err;

    console.log(orders);
    let lstOrders = [];
    if (orders.length > 0) {
      lstOrders = orders;
    }
    res.status(200);    //Code : 200(OK)
    res.json(lstOrders);
  })
});


/** Récupère la commande avec l'id mis en paramètre */
router.get("/:id", function (req, res) {
  Order.find({ id: req.params.id.toString() }, function (err, orders) {
    if (err) throw err;

    if(validator.isEmpty(orders.toString())){
      res.status(404)   //Code : 404(Order not found)
      res.send("Order not found");
    }
    else{
      res.status(200)   //Code : 200(OK)
      res.json(orders);
    }
  });
});


module.exports = router;
