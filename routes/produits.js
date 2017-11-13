var express = require("express");
var router = express.Router();

var validator = require('validator');

var mongoose = require("mongoose");
mongoose.connect('mongodb://admin:1a2b3c@ds255265.mlab.com:55265/online-shop-db');

var Product = mongoose.model('Product');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

/* Get all products */
router.get("/", function(req, res) {
  var cat = req.param('category');
  var crit = req.param('criteria');

  if((cat != null) && cat != "computers" && cat != "cameras" && cat != "consoles" && cat != "screens" && cat!= "all"){
    res.statusCode = "400";
    res.send("Bad Category");
  }
  else if((crit != null) && crit != "price-asc" && crit != "price-dsc" && crit != "alpha-asc" && crit != "alpha-dsc"){
    res.statusCode = "400";
    res.send("Bad Criteria");
  }
  /* No problem detected */
  else{
    /* FIND */
    /* Find all with given category */
    if((cat != null && cat != "" && cat != "all")){
      /* If the category is correct */

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
            else {
              res.statusCode = "400";
              res.send("Bad Criteria");
            }
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

  }

});

/* Find One product by ID */
router.get("/:id", function(req, res) {
  Product.find({id : req.param('id')}, '-_id', function(err, prods){
    if (err) throw err;

    if(validator.isEmpty(prods.toString())){
      res.statusCode = "404";
      res.send("No product found");
    }
    else{
      res.statusCode = "200";
      res.json(prods);
    }
  });
});

router.post("/", function(req, res) {

  /* Verification params */
  var incorrectResponse = "";
  var isIdCorrect = true;
  var isCorrect = true;
  var isFeaturesCorrect = true;
  checkId(req.body.id, function(){
    if(!validator.isNumeric(req.body.id.toString()) || isIdCorrect==false) {isCorrect = false; incorrectResponse += " ID incorrect |";}
    if(validator.isEmpty(req.body.name.toString())) {isCorrect = false; incorrectResponse += " name incorrect |";}
    if(!validator.isDecimal(req.body.price.toString()) || parseInt(req.body.price.toString()) < 0) {isCorrect = false; incorrectResponse += " price incorrect |";}
    if(!validator.isAscii(req.body.image.toString()) || validator.isEmpty(req.body.image.toString())) {isCorrect = false; incorrectResponse += " image incorrect |";}
    if((req.body.category != "cameras") && (req.body.category != "computers") && (req.body.category != "consoles") && (req.body.category != "screens")){isCorrect = false; incorrectResponse += " category incorrect |";}
    if(validator.isEmpty(req.body.description.toString())){isCorrect = false; incorrectResponse += " description incorrect |";}
    if(!checkFeatures(req.body.features)){isCorrect = false; incorrectResponse += " features incorrect |";}


    /* Save product in DB if fiels are corrects */
    if(isCorrect){
      var product = new Product();
      product.id = req.body.id;
      product.name = req.body.name;
      product.price = req.body.price;
      product.image = req.body.image;
      product.category = req.body.category;
      product.description = req.body.description;
      product.features = req.body.features;

      product.save(function(err) {
        if (err){
          res.statusCode = "400";
          res.send(err);
        }

        res.statusCode = "201";
        res.json(req.body);
      });
    }
    else{
      res.statusCode ="400";
      res.send(incorrectResponse);
    }

  });

  /* Check if an element with the same id is already in the DB */
  function checkId(idToCheck, callBack){
    Product.find({id : idToCheck}, function(err, prods){
      if (err) throw err;

      if(validator.isEmpty(prods.toString())){
        console.log("no product existing");
      }
      else{
        console.log("product already existing");
        isIdCorrect = false;
      }
      callBack();
    });
  }

  /* Check if the features are not empty and are strings */
  function checkFeatures(featuresToCheck){

    if(featuresToCheck != null && featuresToCheck != []){
      featuresToCheck.forEach(function (elt){
        console.log(elt.toString());
        if(validator.isEmpty(elt.toString())) isFeaturesCorrect = false;
      });
    }
    return isFeaturesCorrect;
  }

});

/* Delete One */
router.delete("/:id", function(req, res) {
  Product.find({id : req.param('id')}, function(err, prods){
    if (err) throw err;

    if(validator.isEmpty(prods.toString())){
      res.statusCode = "404";
      res.send("No product found");
    }
    else{
      Product.findOneAndRemove({ id: req.param('id') }, function(err) {
        if (err) throw err;
        res.statusCode = "204";
        res.send("Product deleted");
        // we have deleted the user
        console.log('Product deleted!');
      });
    }
  });
});

/* Delete All */
router.delete("/", function(req, res) {
  Product.find({}).remove().exec();
  res.statusCode = "204";
  res.send("Products deleted");
});

module.exports = router;
