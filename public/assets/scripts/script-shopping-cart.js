
$(document).ready(function () {

  var lstProductsSorted = new Array();
  var getPanierRequest = "http://localhost:8000/api/shopping-cart";
  var getProductsRequest = "http://localhost:8000/api/products";
  var items = new Array();

  /** Récupère tous les produits du panier */
  getItemsFromShoppingCart();

  /** Get all items from the shopping-cart by REST request */
  function getItemsFromShoppingCart() {
    $.getJSON(getPanierRequest, function (data) {
      console.log("data : " + data);
      items = data;
      nbProducts = items.length;
      console.log("nombre product : " + nbProducts);
    }).done(function () {
      addItemsToHtmlShopping();
    });
  }

  /** Ajout des élements au panier dans le html */
  async function addItemsToHtmlShopping() {

    /* Si le panier est vide */
    if (items.length == 0) {
      $("#main-cart").empty();
      $("#main-cart").append("<h1 id=\"shop-title\">Panier</h1><p id=\"emptyCart\">Aucun produit dans le panier.</p>");

      //Cache le compte du panier
      $('span.count').hide();
    }
    else {
      /** Récupération des infomations liées aux produits présents dans le panier */
      lstProductsSorted = [];
      var allMyPromises = new Promise(function (resolve) {
        var productPromises = items.map(function (value, index) {
          return new Promise(function (ar) {
            var produc;
            console.log("id : " + value.idProduct);
            var getProductRequest = getProductsRequest + "/" + value.idProduct;

            $.getJSON(getProductRequest, function (data) {
              produc = data;
              console.log(produc);
            }).done(function () {
              ar({ "id": produc.id, "name": produc.name, "price": produc.price, "quantity": value.quantity });
              lstProductsSorted.push({ "id": produc.id, "name": produc.name, "price": produc.price, "quantity": value.quantity });
              console.log("Nombre d'élément dans le panier : " + lstProductsSorted.length);
            });
          });
        });
        Promise.all(productPromises).then(function (values) {
          resolve(values);
        })
      });

      lstProductsSorted = await allMyPromises;

      /* Calcul du prix total du panier */
      calculTotalPrice();
      var totalPriceStr = (((totalPrice).toFixed(2)).toString()).split(".")[0].toString() + "," + (((totalPrice).toFixed(2)).toString()).split(".")[1].toString();

      //////VOIR POUR SUPPRIMER CA
      $("span.count").html(calculTotalQuantity());

      $("#main-cart").empty();
      $("#main-cart").append("<h1 id=\"shop-title\">Panier</h1>\
                              <table id=\"table-shop\">\
                                <tr class=\"tr-border\">\
                                  <th></th>\
                                  <th>Produit</th>\
                                  <th>Prix unitaire</th>\
                                  <th>Quantité</th>\
                                  <th>Prix</th>\
                                </tr>");



      /* Tri de la liste des items du panier */
      function sortJson(a, b) {
        let nameLowerCaseA = a.name.toLowerCase();
        let nameLowerCaseB = b.name.toLowerCase();
        return nameLowerCaseA > nameLowerCaseB ? 1 : -1;
      }
      lstProductsSorted.sort(sortJson);

      /** Liste triée ajoutée au html */
      $.each(lstProductsSorted, function (key, product) {

        let price = ((product.price).toString()).split(".")[0].toString() + "," + ((product.price).toString()).split(".")[1].toString();
        let priceTotalProduct = (((product.price * product.quantity).toFixed(2)).toString()).split(".")[0].toString() + "," + (((product.price * product.quantity).toFixed(2)).toString()).split(".")[1].toString();

        $("#table-shop").append("<tr>\
                                    <td><button id=\"delete-"+ product.id + "\" class=\"remove-item-button\">x</button></td>\
                                    <td><a href=\"product.html?id="+ product.id + "\">" + (product.name).toString() + "</a></td>\
                                    <td >"+ price + "$</td>\
                                    <td><button id=\"reduce-"+ product.id + "\" class=\"remove-quantity-button\">-</button><div class=\"quantity\">" + product.quantity + "</div><button id=\"add-" + product.id + "\" class=\"add-quantity-button\">+</button></td>\
                                    <td class=\"price\">"+ priceTotalProduct + "$</td>\
                                  </tr>");
        if (product.quantity == 1) {
          $("#reduce-" + product.id).attr('disabled', 'disabled');
        }

      });

      $("#table-shop").after("</table>\
                              <p class=\"total-cart\" id=\"total-amount\">Total : <b>"+ totalPriceStr + "$</b></p>\
                                <div class=\"final-buttons-cart\">\
                                <div class=\"col2 cancel-button\">\
                                <button id=\"remove-all-items-button\" class=\"standardButton\">Vider le panier</button>\
                                </div>\
                                <form action=\"/commande\" class=\"col2 confirm-button\">\
                                  <input type=\"submit\" value=\"Commander\" class=\"standardButton\">\
                                </form>\
                              </div>");


      /** OnClick des boutons de suppression d'un produit */
      $(".remove-item-button").click(function () {
        var indexToRemove;
        indexToRemove = this.id.split("-")[1];

        var responseConfirm = confirm("Voulez vous supprimer ce produit du panier?");
        if (responseConfirm == true) {

          let deleteItemRequest = getPanierRequest + "/" + indexToRemove;

          //Envoi de la requète HTTP pour supprimer le produit du panier côté serveur
          $.ajax({
            url: deleteItemRequest,
            type: 'DELETE',
            success: function () {
              getItemsFromShoppingCart();
            }
          });
        }
      });

      /** Onclick des boutons de diminution de la quantité */
      $(".remove-quantity-button").click(function () {
        var indexToReduce;
        indexToReduce = this.id.split("-")[1];
        var ind = -1;

        //Récupération de l'id dans la liste de product du produit
        for (let i = 0; i < lstProductsSorted.length; i++) {
          if (lstProductsSorted[i].id == indexToReduce) {
            ind = i;
          }
        }

        if (ind != -1) {
          let productToChange = { "idProduct": indexToReduce, "quantity": parseInt(lstProductsSorted[ind].quantity) - 1 };

          //Envoi de la requète HTTP pour réduire la quantité du produit dans panier côté serveur
          $.ajax({
            url: getPanierRequest,
            type: 'PUT',
            data: productToChange,
            success: function () {
              getItemsFromShoppingCart();
            }
          });
        }
      });

      /* Onclick des boutons d'augmentation de la quantité */
      $(".add-quantity-button").click(function () {
        var indexToIncrease;
        indexToIncrease = this.id.split("-")[1];
        var ind = -1;

        //Récupération de l'id dans la liste de product du produit
        for (let i = 0; i < lstProductsSorted.length; i++) {
          if (lstProductsSorted[i].id == indexToIncrease) {
            ind = i;
          }
        }

        if (ind != -1) {
          let productToChange = { "idProduct": indexToIncrease, "quantity": parseInt(lstProductsSorted[ind].quantity) + 1 };

          //Envoi de la requète HTTP pour augmenter la quantité du produit dans panier côté serveur
          $.ajax({
            url: getPanierRequest,
            type: 'PUT',
            data: productToChange,
            success: function () {
              getItemsFromShoppingCart();
            }
          });
        }
      });

      /* OnClick du bouton de suppression du panier complet */
      $("#remove-all-items-button").click(function () {
        var responseConfirm = confirm("Voulez-vous supprimer tous les produits du panier ?");
        if (responseConfirm == true) {
          $.ajax({
            url: getPanierRequest,
            type: 'DELETE',
            success: function () {
              getItemsFromShoppingCart();
            }
          });
        }
      });
    }
  };


  /* Calcule le prix total du panier */
  function calculTotalPrice() {
    totalPrice = 0;
    $.each(lstProductsSorted, function (index, value) {
      var product = lstProductsSorted[index];
      totalPrice += (product.price * product.quantity);
    });
  };

  /* Calcule la quantité de produit présent dans le panier */
  function calculTotalQuantity() {
    var totalQuantity = 0;
    $.each(lstProductsSorted, function (index, value) {
      let product = lstProductsSorted[index];
      totalQuantity = parseInt(totalQuantity) + parseInt(product.quantity);
    });
    return totalQuantity;
  };
});
