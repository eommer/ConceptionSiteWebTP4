var express = require("express");
var router = express.Router();
var cookieParser = require("cookie-parser");
var session = require("express-session");

var validator = require('validator');

var mongoose = require("mongoose");
mongoose.connect('mongodb://admin:1a2b3c@ds255265.mlab.com:55265/online-shop-db');

var Product = mongoose.model('Product');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

/* Get all products from shopping-cart*/
router.get("/", function(req, res) {
  if(!req.session.panier){
    req.session.panier = [];
  }
  res.status(200);  //Code 200(OK)
  res.send(req.session.panier);
});

/* Get a product from shopping-cart with its id */
router.get("/:id", function(req, res){
  var productFound = false;
  if(req.session.panier){
    for(var i=0; i<req.session.panier.length; i++){
      console.log("Id du produit : " + req.session.panier[i].idProduct);
      if(req.session.panier[i].idProduct.toString() === req.params.id.toString()){
        productFound = true;
        res.status(200);  //Code 200(OK)
        res.send(req.session.panier[i]);
      }
    }
  }
  else{
    res.status(404);    //Code 404(Not Found)
    res.send("Le panier est vide");
  }
  if(!productFound){
    res.status(404);    //Code 404(Not found)
    res.send("Produit non trouvé dans le panier");
  }
});


/* Post a new product in the shopping-cart */ 
router.post("/", function(req, res) {
  var isCorrect = true;
  var isIdCorrect = true;
  var incorrectResponse = "";
  var nbError = 0;

  checkId(req.body.idProduct, function(){
    if(!validator.isNumeric(req.body.idProduct.toString()) || validator.isEmpty(req.body.idProduct.toString()) || isIdCorrect == false){isCorrect = false; nbError++;; incorrectResponse += " | idProduct";}
    if(!validator.isInt(req.body.quantity.toString(), {min:0}) || validator.isEmpty(req.body.quantity.toString())){isCorrect = false; nbError++; incorrectResponse += " | quantity";}
    
    if(isCorrect){
      if(req.session.panier){
        req.session.panier.push({idProduct: req.body.idProduct, quantity: req.body.quantity});
      }
      else{
        req.session.panier = [];
        req.session.panier.push({idProduct: req.body.idProduct, quantity: req.body.quantity});
      }
      res.status(201);    //Code 201(Created)
      res.send("Produit enregistré dans le panier.\nIl y a maintenant : " + req.session.panier.length);
    }
    else{
      res.status(400);    //Code 400(Bad request)
      res.send("Mauvaise requète. Il y a " + nbError + "élément(s) qui n'ont pas le bon le format \nErreur : " + incorrectResponse);
    }
  });

  /* Check if an element with the same id is in the database */
  function checkId(idToCheck, callBack){
    Product.find({id : idToCheck}, function(err, prods){
      if (err) throw err;

      if(validator.isEmpty(prods.toString())){
        console.log("no product with this id");
        isIdCorrect = false;
      }
      else{
        console.log("product with this id");
      }
      callBack();
    });
  }
});


module.exports = router;
