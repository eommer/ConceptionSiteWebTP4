
$(document).ready(function () {

  var items = new Array();
  var selectedItems = new Array();
  var nbProducts;
  var getProductsRequest = "http://localhost:8000/api/products";
  var categoryField = "all";
  var criteriaField = "price-asc";

  getProducts();

  /* Gestion des catégories */
  $('#cameras').click(function () {
    categoryField = "cameras";
    clearCategoryClasses();
    $("#cameras").addClass("selected");
    getProducts();
  })
  $('#consoles').click(function () {
    categoryField = "consoles";
    clearCategoryClasses();
    $("#consoles").addClass("selected");
    getProducts();
  })
  $('#screens').click(function () {
    categoryField = "screens";
    clearCategoryClasses();
    $("#screens").addClass("selected");
    getProducts();
  })
  $('#computers').click(function () {
    categoryField = "computers";
    clearCategoryClasses();
    $("#computers").addClass("selected");
    getProducts();
  })
  $('#all').click(function () {
    categoryField = "all";
    clearCategoryClasses();
    $("#all").addClass("selected");
    getProducts();
  })

  /* Gestion des critères */
  $('#priceUp').click(function () {
    criteriaField = "price-asc";
    clearCriteriaClasses();
    $("#priceUp").addClass("selected");
    getProducts();
  })
  $('#priceDown').click(function () {
    criteriaField = "price-dsc";
    clearCriteriaClasses();
    $("#priceDown").addClass("selected");
    getProducts();
  })
  $('#alphaUp').click(function () {
    criteriaField = "alpha-asc";
    clearCriteriaClasses();
    $("#alphaUp").addClass("selected");
    getProducts();
  })
  $('#alphaDown').click(function () {
    criteriaField = "alpha-dsc";
    clearCriteriaClasses();
    $("#alphaDown").addClass("selected");
    getProducts();
  })

  /** Get products using a REST request */
  function getProducts() {
    getProductsRequest = "http://localhost:8000/api/products?category=" + categoryField + "&criteria=" + criteriaField;
    $.getJSON(getProductsRequest, function (data) {
      items = data;
      nbProducts = items.length;

    }).done(function () {
      addItemsToHtmlProducts();
    });

  }

  /** Ajoute les éléments issus du la liste dans le html */
  function addItemsToHtmlProducts() {
    $("#products-list").empty();
    $.each(items, function (key, val) {
      let price = ((val.price).toString()).split(".")[0].toString() + "," + ((val.price).toString()).split(".")[1].toString();

      //Insere le produit dans la liste
      $("#products-list").append(
        "<section id=\"" + val.id + "\" class=\"not-last-prod-row\">\
          <a href=\"produit?id="+ val.id + "\">\
            <h1>"+ val.name + "</h1>\
            <img src=\"assets/img/"+ val.image + "\" alt=\"image produit\">\
            <p>"+ price + "$</p>\
          </a>\
        </section>"
      );

    });

    $("#products-count").empty();
    $("#products-count").append(nbProducts + " produits");
  };

  /** Récupère quel critère doit être appliqué */
  function getCriteriaClass() {
    if ($("#priceUp").hasClass("selected")) { return "priceUp"; }
    else if ($("#priceDown").hasClass("selected")) { return "priceDown"; }
    else if ($("#alphaUp").hasClass("selected")) { return "alphaUp"; }
    else if ($("#alphaDown").hasClass("selected")) { return "alphaDown"; }
  }

  /** Enleve la classe selected à tous les critères */
  function clearCriteriaClasses() {
    $("#priceUp").removeClass();
    $("#priceDown").removeClass();
    $("#alphaUp").removeClass();
    $("#alphaDown").removeClass();
  };

  /** Enleve la classe selected à toutes les catégories */
  function clearCategoryClasses() {
    $("#cameras").removeClass();
    $("#consoles").removeClass();
    $("#screens").removeClass();
    $("#computers").removeClass();
    $("#all").removeClass();
  };
});
