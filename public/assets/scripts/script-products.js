
$(document).ready(function() {

  var items = new Array();
  var selectedItems = new Array();
  var nbProducts;

  /* Parsing du fichier Json */
  $.getJSON( "./data/products.json", function( data ) {
    var sortByPrice = true;
    items = data;
    selectedItems = items;
    nbProducts = items.length;

    }).done(function(){

      /* Gestion des catégories */
      $('#cameras').click(function(){
        selectCategory("cameras");
        clearCategoryClasses();
        $("#cameras").addClass("selected");
      })
      $('#consoles').click(function(){
        selectCategory("consoles");
        clearCategoryClasses();
        $("#consoles").addClass("selected");
      })
      $('#screens').click(function(){
        selectCategory("screens");
        clearCategoryClasses();
        $("#screens").addClass("selected");
      })
      $('#computers').click(function(){
        selectCategory("computers");
        clearCategoryClasses();
        $("#computers").addClass("selected");
      })
      $('#all').click(function(){
        selectCategory("all");
        clearCategoryClasses();
        $("#all").addClass("selected");
      })

      /* Tri la liste des produits avec le critère par défaut une première fois */
      sortJsonField(getCriteriaClass());

      /* Gestion des critères */
      $('#priceUp').click(function(){
        sortJsonField("priceUp");
        clearCriteriaClasses();
        $("#priceUp").addClass("selected");
      })
      $('#priceDown').click(function(){
        sortJsonField("priceDown");
        clearCriteriaClasses();
        $("#priceDown").addClass("selected");
      })
      $('#alphaUp').click(function(){
        sortJsonField("alphaUp");
        clearCriteriaClasses();
        $("#alphaUp").addClass("selected");
      })
      $('#alphaDown').click(function(){
        sortJsonField("alphaDown");
        clearCriteriaClasses();
        $("#alphaDown").addClass("selected");
      })
  });

  /* Selectionne les produits à afficher en fonction de leur catégorie */
  function selectCategory(category){
    selectedItems = [];
    if(category == "all"){
      selectedItems = items.slice();
      nbProducts = items.length;
    }
    else{
      nbProducts = 0;
      $.each( items, function( key, val ) {
        if(val.category == category){
          console.log(key)
          selectedItems.push(items[key]);
          nbProducts ++;
        }
      });
    }
    sortJsonField(getCriteriaClass());
    addItemsToHtmlProducts();
  };

  /* Tri la liste des items à afficher en fonction du critère */
  function sortJsonField(field){
    function sortJson(a,b){
      if(field == "priceUp"){ return a.price > b.price? 1 : -1; }
      else if(field == "priceDown"){ return a.price > b.price? -1 : 1; }
      else if(field == "alphaUp"){
        let nameLowerCaseA = a.name.toLowerCase();
        let nameLowerCaseB = b.name.toLowerCase();
        return nameLowerCaseA > nameLowerCaseB? 1 : -1;}
      else if(field == "alphaDown"){
        let nameLowerCaseA = a.name.toLowerCase();
        let nameLowerCaseB = b.name.toLowerCase();
        return nameLowerCaseA > nameLowerCaseB? -1 : 1;}
    }
    selectedItems.sort(sortJson);
    addItemsToHtmlProducts();
  };

  /* Ajoute les éléments issus du la liste dans le html */
  function addItemsToHtmlProducts(){
    $( "#products-list" ).empty();
    $.each( selectedItems, function( key, val ) {
      console.log(val);
      let price = ((val.price).toString()).split(".")[0].toString() + "," + ((val.price).toString()).split(".")[1].toString();

      //Insere le produit dans la liste
      $( "#products-list" ).append(
        "<section id=\""+val.id+"\" class=\"not-last-prod-row\">\
          <a href=\"product.html?id="+val.id +"\">\
            <h1>"+val.name+"</h1>\
            <img src=\"assets/img/"+val.image+"\" alt=\"image produit\">\
            <p>"+price+"$</p>\
          </a>\
        </section>"
      );

    });

    $("#products-count").empty();
    $("#products-count").append(nbProducts+" produits");
  };

  /* Récupère quel critère doit être appliqué */
  function getCriteriaClass(){
    if($("#priceUp").hasClass("selected")){return "priceUp";}
    else if($("#priceDown").hasClass("selected")){return "priceDown";}
    else if($("#alphaUp").hasClass("selected")){return "alphaUp";}
    else if($("#alphaDown").hasClass("selected")){return "alphaDown";}
  }

  /* Enleve la classe selected à tous les critères */
  function clearCriteriaClasses(){
    $("#priceUp").removeClass();
    $("#priceDown").removeClass();
    $("#alphaUp").removeClass();
    $("#alphaDown").removeClass();
  };

  /* Enleve la classe selected à toutes les catégories */
  function clearCategoryClasses(){
    $("#cameras").removeClass();
    $("#consoles").removeClass();
    $("#screens").removeClass();
    $("#computers").removeClass();
    $("#all").removeClass();
  };

});
