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
      if(req.session.panier[i].id.toString() === req.params.id.toString()){
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
  var isItemAlreadyInShoppingCart = false;
  var incorrectResponse = "";
  var nbError = 0;

  checkId(req.body.id, function(){
    if(!validator.isNumeric(req.body.id.toString()) || validator.isEmpty(req.body.id.toString()) || isIdCorrect == false){isCorrect = false; nbError++;; incorrectResponse += " | id";}
    if(!validator.isInt(req.body.quantity.toString(), {min:0}) || validator.isEmpty(req.body.quantity.toString())){isCorrect = false; nbError++; incorrectResponse += " | quantity";}

    if(isCorrect){
      //Regarde si le panier existe
      if(req.session.panier){
        //Regarde si un produit déjà présent dans le panier possède cet id
        for(var i = 0; i<req.session.panier.length; i++){
          if(req.session.panier[i].id === req.body.id) {isItemAlreadyInShoppingCart = true;}
        }

        if(!isItemAlreadyInShoppingCart){
          req.session.panier.push({id: req.body.id, quantity: req.body.quantity});

          res.status(201);    //Code 201(Created)
          res.send("Produit enregistré dans le panier.\nIl y a maintenant : " + req.session.panier.length);
        }

        else{
          res.status(400);   //Code 400(Bad request)
          res.send("Le produit est déjà enregistré dans le panier. Utilisez la méthode PUT.");
        }
      }
      else{
        req.session.panier = [];
        req.session.panier.push({id: req.body.id, quantity: req.body.quantity});

        res.status(201);    //Code 201(Created)
        res.send("Produit enregistré dans le panier.\nIl y a maintenant : " + req.session.panier.length);
      }
    }
    else{
      res.status(400);    //Code 400(Bad request)
      res.send("Mauvaise requète. Il y a " + nbError + "élément(s) qui n'ont pas le bon le format \nErreur : " + incorrectResponse);
    }
  });

  /* Check if an element with the same id is in the database */
  function checkId(idToCheck, callBack){
    Product.find({id : idToCheck}, function(err, prods){
      //if (err) throw err;
      if(err){
        console.log(err.toString());
      }

      if(validator.isEmpty(prods.toString())){
        isIdCorrect = false;
      }

      callBack();
    });
  }
});

/* Mise à jour d'un item dans le panier */
router.put("/", function(req, res){
  var isCorrect = true;
  var isIdCorrect = true;
  var locationItem;
  var isItemAlreadyInShoppingCart = false;
  var incorrectResponse = "";
  var nbError = 0;

  checkId(req.body.id, function(){
    if(!validator.isNumeric(req.body.id.toString()) || validator.isEmpty(req.body.id.toString()) || isIdCorrect == false){isCorrect = false; nbError++;; incorrectResponse += " | id";}
    if(!validator.isInt(req.body.quantity.toString(), {min:0}) || validator.isEmpty(req.body.quantity.toString())){isCorrect = false; nbError++; incorrectResponse += " | quantity";}

    if(isCorrect){
      //Vérifie la présence du panier
      if(req.session.panier){
        //Regarde si le produit est déjà présent dans le panier
        for(var i = 0; i<req.session.panier.length; i++){
          if(req.session.panier[i].id === req.body.id) {isItemAlreadyInShoppingCart = true; locationItem = i;}
        }
        if(isItemAlreadyInShoppingCart){
          req.session.panier[locationItem].quantity = req.body.quantity;

          res.status(204);    //Code 204(No content)
          res.send();
        }
        else{
          res.status(404);   //Code 404(Not found)
          res.send("Le produit n'est pas présent dans le panier");
        }
      }
      else{
        res.status(404);   //Code 404(Not found)
        res.send("Le panier est vide");
      }
    }
    else{
      res.status(400);    //Code 400(Bad request)
      res.send("Mauvaise requète. Il y a " + nbError + "élément(s) qui n'ont pas le bon le format \nErreur : " + incorrectResponse);
    }
  });

  /* Check if an element with the same id is in the database */
  function checkId(idToCheck, callBack){
    Product.find({id : idToCheck}, function(err, prods){
      //if (err) throw err;
      if(err){
        console.log(err.toString());
      }

      if(validator.isEmpty(prods.toString())){
        isIdCorrect = false;
      }
      callBack();
    });
  }
});

/* Supprime un produit du panier */
router.delete("/:id", function(req, res){
  var itemRemove = false;
  if(req.session.panier){
    for(var i = 0; i<req.session.panier.length; i++){
      if(req.session.panier[i].id.toString() === req.params.id.toString()){
        itemRemove = true;
        req.session.panier.splice(i, 1);
        res.status(204);    //Code 204(No content)
        res.send();
      }
    }
    if(!itemRemove){
      res.status(404);    //Code 404(Not found)
      res.send("Le produit avec l'id " + req.params.id + " n'existe pas dans le panier");
    }
  }
  else{
    res.status(404);    //Code 404(Not found)
    res.send("Le panier n'existe pas");
  }
});

/* Supprime tout le panier */
router.delete("/", function(req, res){
  req.session.panier = [];
  res.status(204);    //Code 204(No Content)
  res.send();
});


module.exports = router;
