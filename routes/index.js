var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
  res.render("index", { title: "Accueil", active: "accueil" });
});

router.get("/accueil", function (req, res) {
  res.render("index", { title: "Accueil", active: "accueil" });
});

router.get("/produits", function (req, res) {
  res.render("products", { title: "Produits", active: "produits" });
});

router.get("/produit", function (req, res) {
  var id = req.param("id");
  res.render("product", { title: "Produit", id: id });
});

router.get("/contact", function (req, res) {
  res.render("contact", { title: "Contact", active: "contact" });
});

router.get("/confirmation", function (req, res) {
  res.render("confirmation", { title: "Confirmation" });
});

router.get("/commande", function (req, res) {
  res.render("order", { title: "Commande" });
});

router.get("/panier", function (req, res) {
  res.render("shopping-cart", { title: "Panier" });
});


module.exports = router;
