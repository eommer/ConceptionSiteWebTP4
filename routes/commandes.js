var express = require("express");
var router = express.Router();

var validator = require('validator');

var mongoose = require("mongoose");
mongoose.connect('mongodb://admin:1a2b3c@ds255265.mlab.com:55265/online-shop-db');

var Order = mongoose.model('Order');
var Product = mongoose.model('Product');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

/** Récupère toutes les commandes présentes dans la base de données */
router.get("/", function (req, res) {
  Order.find({}, {_id : 0}, function (err, orders) {
    if (err) throw err;

    console.log(" GET ALL : " + orders);
    let lstOrders = [];
    if (orders.length > 0) {
      lstOrders = orders;
    }
    res.status(200);    //Code : 200(OK)
    res.send(lstOrders);
  })
});


/** Récupère la commande avec l'id mis en paramètre */
router.get("/:id", function (req, res) {
  Order.find({ id: req.params.id.toString() }, {_id : 0}, function (err, orders) {
    if (err) throw err;

    if (validator.isEmpty(orders.toString())) {
      res.status(404)   //Code : 404(Order not found)
      res.send("Order not found");
    }
    else {
      console.log("GET " + req.params.id.toString() + " : " + orders)
      res.status(200)   //Code : 200(OK)
      res.send(orders[0]);
    }
  });
});


/** Récupère la commande avec l'id mis en paramètre */
router.post("/", function (req, res) {
  /* Verification params */
  var incorrectResponse = "";
  var isIdCorrect = true;
  var isCorrect = true;
  var isFeaturesCorrect = true;
  var isProductsExisting = true;

  checkId(req.body.id, function () {
    checkProducts(req.body.products, function(){
      if (!validator.isNumeric(req.body.id.toString()) || isIdCorrect == false) { isCorrect = false; incorrectResponse += " ID order incorrect |"; }
      if (validator.isEmpty(req.body.firstName.toString())) { isCorrect = false; incorrectResponse += " firstName incorrect |"; }
      if (validator.isEmpty(req.body.lastName.toString())) { isCorrect = false; incorrectResponse += " lastName incorrect |"; }
      if (validator.isEmpty(req.body.email.toString()) || !validator.isEmail(req.body.email.toString())) { isCorrect = false; incorrectResponse += " email incorrect |"; }
      if (validator.isEmpty(req.body.phone.toString()) || !validator.isMobilePhone(req.body.phone.toString(), 'any')) { isCorrect = false; incorrectResponse += " phone incorrect |"; }
      if (!isProductsExisting) { isCorrect = false; incorrectResponse += " products incorrect |"; }


      /* Save product in DB if fiels are corrects */
      if (isCorrect) {
        var order = new Order();
        order.id = req.body.id;
        order.firstName = req.body.firstName;
        order.lastName = req.body.lastName;
        order.email = req.body.email;
        order.phone = req.body.phone;
        order.products = req.body.products;

        order.save(function (err) {
          if (err) {
            res.status(400);    //Code 400(Bad request)
            res.send(err);
          }

          res.status(201);      //Code 201(Created)
          res.send("Bien enregistré dans la base de données");
        });
      }
      else {
        res.status(400);        //Code 400(Bad request)
        res.send(incorrectResponse);
      }
    });


  });


  /* Check if an element with the same id is already in the DB */
  function checkId(idToCheck, callBack) {
    Order.find({ id: idToCheck }, function (err, orders) {
      if (err) throw err;

      if (validator.isEmpty(orders.toString())) {
        console.log("no order existing");
      }
      else {
        console.log("order id already existing");
        isIdCorrect = false;
      }
      callBack();
    });
  }


  /* Vérifie que les informations (id et quantity) sur les produits sont ok */
  function checkProducts(ProductsToCheck, callback) {
    var nbProductsChecked = 0;
    if (ProductsToCheck != null && ProductsToCheck != []) {
      console.log("length prods : " + ProductsToCheck.length);
      for(let prod of ProductsToCheck){
        //console.log(prod.id.toString());
        if (validator.isEmpty(prod.id.toString()) || !validator.isInt(prod.id.toString())){isFeaturesCorrect = false; incorrectResponse += " id product incorect |";}
        if (validator.isEmpty(prod.quantity.toString()) || !validator.isInt(prod.quantity.toString())) {isFeaturesCorrect = false; incorrectResponse += " quantity product incorrect |";}
        Product.find({id : prod.id.toString()}, {_id : 0}, function(err, prods){
          if (err) throw err;

          if(validator.isEmpty(prods.toString())){
            console.log("product not found in db");
            isProductsExisting = false;
            incorrectResponse += "id product not found | "
          }
          else{
            console.log("product found in db");
          }
        });
      }

      callback();

    }
    else{
      callback();
    }
  }


});


/** Supprime une commande dans la base de données en fonction de l'id passé en paramètre */
router.delete("/:id", function (req, res) {
  Order.find({ id: req.params.id.toString() }, function (err, orders) {
    if (err) throw err;

    if (validator.isEmpty(orders.toString())) {
      res.status(404);    //Code 404(Not found)
      res.send("Order found not found");
    }
    else {
      Order.findOneAndRemove({ id: req.params.id.toString() }, function (err) {
        if (err) throw err;
        res.status(204);    //Code 204(No content)
        res.send();
      });
    }
  });
});


/** Supprime toutes les commandes présentes dans la base de données */
router.delete("/", function (req, res) {
  Order.find({}).remove().exec();
  res.status(204);      //Code 204(No content)
  res.send();
});


module.exports = router;
