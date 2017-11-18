$(document).ready(function () {
  var orderRequest = "http://localhost:8000/api/order/";
  var shoppingCartRequest = "http://localhost:8000/api/shopping-cart/";
  var orders = new Array();
  var items = new Array();
  var order;


  var validator = $("#order-form").validate({
    rules: {
      firstname: {
        required: true,
        minlength: 2
      },
      lastname: {
        required: true,
        minlength: 2
      },
      email: {
        required: true,
        email: true
      },
      phone: {
        required: true,
        phoneUS: true
      },
      creditcard: {
        required: true,
        creditcard: true
      },
      creditcardexpiry: {
        required: true,
        creditcardexpiry: true
      },
    },
    messages: {
    },
    submitHandler: function () {
      console.log("onClickValidate");

      $.getJSON(orderRequest, function (data) {
        orders = data;
        let nbOrders = orders.length;
        console.log("nombre de commande : " + nbOrders);
      }).done(function () {
        $.getJSON(shoppingCartRequest, function (data) {
          items = data;
        }).done(function () {
          //Pas encore de commande dans la base de données
          if (orders.length == 0) {
            order = JSON.stringify({ "id": 0, "firstName": $("#first-name").val(), "lastName": $("#last-name").val(), "email": $("#email").val(), "phone": $("#phone").val(), "products": items });
          }
          else {
            order = JSON.stringify({ "id": parseInt(orders[orders.length-1].id) + 1, "firstName": $("#first-name").val(), "lastName": $("#last-name").val(), "email": $("#email").val(), "phone": $("#phone").val(), "products": items });
          }

          jQuery.ajax({
            url: orderRequest,
            type: "POST",
            data: order,
            contentType: "application/json",
            complete: function (res) {
              console.log("res : " + res.status);

              if(res.status == 201){
                //$("#order-form").ajaxSubmit();
                submitHandler();
                $("#order-form").submit();
              }
              else{
                alert("Erreur dans l'enregistrement de votre commande : " + res);
              }
            }
          });
      });
    });

      //getOrders();
    }
  });

  $.validator.addMethod("creditcardexpiry", function (value, element) {
    // allow any non-whitespace characters as the host part
    return this.optional(element) || /^(0[1-9]|1[0-2])\/\d{2}$/.test(value);
  }, "La date d\'expiration de votre carte de crédit est invalide.");

  validator.form();
});


/** Permet de récupérer la liste des commandes de la base de données */
/*function getOrders() {
  $.getJSON(orderRequest, function (data) {
    orders = data;
    let nbOrders = items.length;
    console.log("nombre de commande : " + nbOrders);
  }).done(function () {
    getItemsFromOrder();
  });
}*/


/** Récupère les produits enregistrés dans le panier */
/*function getItemsFromOrder() {
  $.getJSON(shoppingCartRequest, function (data) {
    items = data;
  }).done(function () {
    //Pas encore de commande dans la base de données
    if (orders.length == 0) {
      order = JSON.stringify({ "id": 0, "firstName": $("#first-name").val(), "lastName": $("#last-name").val(), "email": $("#email").val(), "phone": $("#phone").val(), "products": items });
    }
    else {
      order = JSON.stringify({ "id": parseInt(orders[orders.length].id) + 1, "firstName": $("#first-name").val(), "lastName": $("#last-name").val(), "email": $("#email").val(), "phone": $("#phone").val(), "products": items });
    }

    //Envoie au serveur de la commande pour sauvegarder dans la base de données
    postOrder();

  });
}*/

/** Envoie au serveur de la commande pour la sauvegarder dans la base de données */
/*function postOrder() {
  jQuery.ajax({
    url: orderRequest,
    type: "POST",
    data: order,
    contentType: "application/json",
    complete: function (res) {
      console.log("res : " + res.status);
      
      $("#order-form").ajaxSubmit();
    }
  });
}*/
