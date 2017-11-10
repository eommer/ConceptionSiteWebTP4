var express = require("express");
var router = express.Router();
var cookieParser = require("cookie-parser");
var session = require("express-session");

var mongoose = require("mongoose");
mongoose.connect('mongodb://admin:1a2b3c@ds255265.mlab.com:55265/online-shop-db');

var Product = mongoose.model('Product');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

/* Get all products from shopping-cart*/
router.get("/", function(req, res) {
  if(!req.session.panier){
    res.session.panier = [];
  }
  res.status(200);  //Code 200(OK)
  res.send(res.session.panier);
});

/* Get a product from shopping-cart */
router.get("/:id", function(req, res){
  var productFound = false;
  if(req.session.panier){
    for(var i=0; i<req.session.panier.length; i++){
      if(req.session.panier[i].idProduct === req.params.id){
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


/* Post a new item in the shopping-cart */ 
router.post("/", function(req, res) {
  var isCorrect = true;
  var nbError = 0;

  ///Rajouter la vérif que l'id existe dans la base de donnée
  if(!validator.isNumeric(req.body.idProduct.toString())){isCorrect = false; nbError++;}
  if(!validator.isInt(req.body.quantity.toString(), {min:0})){isCorrect = false; nbError++;}

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
    res.send("Mauvaise requète. Il y a " + nbError + "élément(s) qui n'ont pas le bon le format");
  }
  
});


module.exports = router;
