
$(document).ready(function() {

  var lstProductsSorted = new Array();

    addItemsToHtmlShopping();

    /* Ajout des élements au panier dans le html */
    function addItemsToHtmlShopping(){

      if(typeof localStorage!='undefined') {
        /* Calcul du prix total du panier */
        calculTotalPrice();
        var totalPriceStr = (((totalPrice).toFixed(2)).toString()).split(".")[0].toString() + "," + (((totalPrice).toFixed(2)).toString()).split(".")[1].toString();

        var count = 0;
        if(localStorage.getItem(-1) != null){
            count++;
        }
        if(localStorage.getItem(-2) != null){
            count++;
        }

        if(localStorage.length - count == 0){
          $("#main-cart").empty();
          $("#main-cart").append("<h1 id=\"shop-title\">Panier</h1><p id=\"emptyCart\">Aucun produit dans le panier.</p>");

          //Cache le compte du panier
          $('span.count').hide();
        }
        else{
          $("#main-cart").empty();
          $("#main-cart").append ("<h1 id=\"shop-title\">Panier</h1>\
                                  <table id=\"table-shop\">\
                                    <tr class=\"tr-border\">\
                                      <th></th>\
                                      <th>Produit</th>\
                                      <th>Prix unitaire</th>\
                                      <th>Quantité</th>\
                                      <th>Prix</th>\
                                    </tr>");

          lstProductsSorted = [];

          $.each(localStorage, function(index, value){
            if(index >= 0){
              var prod = JSON.parse(localStorage.getItem(index));
              lstProductsSorted.push(prod);
            }
          });

            /* Tri de la liste des items du panier */
            function sortJson(a,b){
                let nameLowerCaseA = a.name.toLowerCase();
                let nameLowerCaseB = b.name.toLowerCase();
                return nameLowerCaseA > nameLowerCaseB? 1 : -1;
            }
            lstProductsSorted.sort(sortJson);

            /* Liste triée ajoutée au html */
            $.each(lstProductsSorted, function( key, product ){

              let price = ((product.price).toString()).split(".")[0].toString() + "," + ((product.price).toString()).split(".")[1].toString();
              let priceTotalProduct = (((product.price*product.quantity).toFixed(2)).toString()).split(".")[0].toString() + "," + (((product.price*product.quantity).toFixed(2)).toString()).split(".")[1].toString();

              $("#table-shop").append("<tr>\
                                        <td><button id=\"delete-"+product.id+"\" class=\"remove-item-button\">x</button></td>\
                                        <td><a href=\"product.html?id="+product.id+"\">"+(product.name).toString()+"</a></td>\
                                        <td >"+price+"$</td>\
                                        <td><button id=\"reduce-"+product.id+"\" class=\"remove-quantity-button\">-</button><div class=\"quantity\">"+product.quantity+"</div><button id=\"add-"+product.id+"\" class=\"add-quantity-button\">+</button></td>\
                                        <td class=\"price\">"+priceTotalProduct+"$</td>\
                                      </tr>");
              if(product.quantity == 1){
                $("#reduce-" + product.id).attr('disabled','disabled');
              }

            });

          $("#table-shop").after ("</table>\
                                  <p class=\"total-cart\" id=\"total-amount\">Total : <b>"+totalPriceStr+"$</b></p>\
                                    <div class=\"final-buttons-cart\">\
                                    <div class=\"col2 cancel-button\">\
                                    <button id=\"remove-all-items-button\" class=\"standardButton\">Vider le panier</button>\
                                    </div>\
                                    <form action=\"order.html\" class=\"col2 confirm-button\">\
                                      <input type=\"submit\" value=\"Commander\" class=\"standardButton\">\
                                    </form>\
                                  </div>");

          /* OnClick des boutons de suppression d'un produit */
          $(".remove-item-button").click(function(){
            var indexToRemove;
            indexToRemove = this.id.split("-")[1];

            var responseConfirm = confirm("Voulez vous supprimer ce produit du panier?");
            if(responseConfirm == true){
              localStorage.removeItem(indexToRemove);
              addItemsToHtmlShopping();

              //To calculate the quantity
              var totalQuantity = 0;
              $.each(localStorage, function(index, value){
                  if(index >= 0){
                      let product = JSON.parse(localStorage.getItem(index));
                      totalQuantity = parseInt(totalQuantity) + parseInt(product.quantity);
                  }
              });

              $('span.count').html(calculTotalQuantity);
            }
          });

          /* Onclick des boutons de diminution de la quantité */
          $(".remove-quantity-button").click(function(){
            var indexToReduce;
            indexToReduce = this.id.split("-")[1];
            var productToReduce = JSON.parse(localStorage.getItem(indexToReduce));
            if(productToReduce.quantity > 1){
              productToReduce.quantity --;
              localStorage.setItem(productToReduce.id, JSON.stringify(productToReduce));
            }
            addItemsToHtmlShopping();
            if(productToReduce.quantity === 1){
              $("#"+this.id).attr('disabled','disabled');
            }
            else{
              $("#"+this.id).removeAttr('disabled');
            }

            //Changement du compte du panier
            $('span.count').html(calculTotalQuantity);
          });

          /* Onclick des boutons d'augmentation de la quantité */
          $(".add-quantity-button").click(function(){
            var indexToIncrease;
            indexToIncrease = this.id.split("-")[1];

            var productToIncrease = JSON.parse(localStorage.getItem(indexToIncrease));
            productToIncrease.quantity ++;
            localStorage.setItem(productToIncrease.id, JSON.stringify(productToIncrease));
            addItemsToHtmlShopping();

            //To calculate the quantity
            var totalQuantity = 0;
            $.each(localStorage, function(index, value){
                if((index != -1) && (index != -2)){
                    let product = JSON.parse(localStorage.getItem(index));
                    totalQuantity = parseInt(totalQuantity) + parseInt(product.quantity);
                }
            });

            //Changement du compte du panier
            $('span.count').html(calculTotalQuantity);
          });

          /* OnClick du bouton de suppression du panier complet */
          $("#remove-all-items-button").click(function(){
            var responseConfirm = confirm("Voulez-vous supprimer tous les produits du panier ?");
            if(responseConfirm == true){
              //Id commandes est sauvegardé le localStorage à l'index -1
              var numCommande = JSON.parse(localStorage.getItem(-1));
              localStorage.clear();
              localStorage.setItem(-1, JSON.stringify(numCommande));
              $('span.count').hide();
              addItemsToHtmlShopping();
            }
          });
        }
      }
      else{
        alert("localStorage n'est pas supporté");
      }
    };

    /* Calcule le prix total du panier */
    function calculTotalPrice(){
      totalPrice = 0;
      $.each(localStorage, function(index, value){
        if((index != -1) && (index != -2)){
          var product = JSON.parse(localStorage.getItem(index));
          totalPrice += (product.price*product.quantity);
        }
      });
    };

    function calculTotalQuantity(){
      var totalQuantity = 0;
      $.each(localStorage, function(index, value){
          if((index != -1) && (index != -2)){
              let product = JSON.parse(localStorage.getItem(index));
              totalQuantity = parseInt(totalQuantity) + parseInt(product.quantity);
          }
      });
      return totalQuantity;
    };



});
