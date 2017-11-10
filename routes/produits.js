var express = require("express");
var router = express.Router();

var mongoose = require("mongoose");
mongoose.connect('mongodb://admin:1a2b3c@ds255265.mlab.com:55265/online-shop-db');

var Product = mongoose.model('Product');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

/* Get all products */
router.get("/", function(req, res) {
  var cat = req.param('category');
  var crit = req.param('criteria');
  var products = [];

  /* FIND */
  /* Find all with given category */
  if((cat != null && cat != "")){
    Product.find({ category : cat}, function(err, prods){
      /* CRITERIA */
      if((crit != null && crit != "")){
        function sortJson(a,b){
          if(crit == "price-asc"){ return a.price > b.price? 1 : -1; }
          else if(crit == "price-dsc"){ return a.price > b.price? -1 : 1; }
          else if(crit == "alpha-asc"){
            let nameLowerCaseA = a.name.toLowerCase();
            let nameLowerCaseB = b.name.toLowerCase();
            return nameLowerCaseA > nameLowerCaseB? 1 : -1;}
          else if(crit == "alpha-dsc"){
            let nameLowerCaseA = a.name.toLowerCase();
            let nameLowerCaseB = b.name.toLowerCase();
            return nameLowerCaseA > nameLowerCaseB? -1 : 1;}
        }
        prods.sort(sortJson);
      }

      res.json(prods);
    });
  }
  /* Find all */
  else{
    Product.find({}, function(err, prods){
      /* CRITERIA */
      if((crit != null && crit != "")){
        function sortJson(a,b){
          if(crit == "price-asc"){ return a.price > b.price? 1 : -1; }
          else if(crit == "price-dsc"){ return a.price > b.price? -1 : 1; }
          else if(crit == "alpha-asc"){
            let nameLowerCaseA = a.name.toLowerCase();
            let nameLowerCaseB = b.name.toLowerCase();
            return nameLowerCaseA > nameLowerCaseB? 1 : -1;}
          else if(crit == "alpha-dsc"){
            let nameLowerCaseA = a.name.toLowerCase();
            let nameLowerCaseB = b.name.toLowerCase();
            return nameLowerCaseA > nameLowerCaseB? -1 : 1;}
        }
        prods.sort(sortJson);
      }

      res.json(prods);
    });
  }




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
