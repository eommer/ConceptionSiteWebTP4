var express = require("express");
var router = express.Router();

var mongoose = require("mongoose");
mongoose.connect('mongodb://admin:1a2b3c@ds255265.mlab.com:55265/online-shop-db');

var Product = mongoose.model('Product');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

/* Get all products */
router.get("/", function(req, res) {
  var category = req.param('category');
  var criteria = req.param('criteria');

  Product.find({}, function(err, prods){
    res.send(prods);
  });
});

router.post("/", function(req, res) {
  console.log(req.body);
  var product = new Product();
  product.id = req.body.id;
  product.name = req.body.name;
  product.price = req.body.price;
  product.image = req.body.image;
  product.category = req.body.category;
  product.description = req.body.description;
  product.features = req.body.features;

  product.save(function(err) {
            if (err)
                res.send(err);

            res.json(req.body);
  });


});



module.exports = router;
