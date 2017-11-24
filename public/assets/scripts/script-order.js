$(document).ready(function () {
  var orderRequest = "http://localhost:8000/api/orders/";
  var shoppingCartRequest = "http://localhost:8000/api/shopping-cart/";
  var orders = new Array();
  var items = new Array();
  var itemsForOrder = new Array();
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
      $.getJSON(orderRequest, function (data) {
        orders = data;
        let nbOrders = orders.length;
      }).done(function () {
        $.getJSON(shoppingCartRequest, function (data) {
          items = data;
          var index = 0;
          items.forEach(function (val) {
            var newItem = { id: val.productId, quantity: val.quantity };
            itemsForOrder[index] = newItem;
            index++;
          })
        }).done(function () {
          var idOrder;
          //Pas encore de commande dans la base de données
          if (orders.length == 0) {
            idOrder = 1;
          }
          else {
            idOrder = parseInt(orders[orders.length - 1].id) + 1;
          }
          order = JSON.stringify({ "id": idOrder, "firstName": $("#first-name").val(), "lastName": $("#last-name").val(), "email": $("#email").val(), "phone": $("#phone").val(), "products": itemsForOrder });

          jQuery.ajax({
            url: orderRequest,
            type: "POST",
            data: order,
            contentType: "application/json",
            complete: function (res) {

              if (res.status == 201) {
                //Suppression de tous les éléments du panier
                $.ajax({
                  url: shoppingCartRequest,
                  type: 'DELETE',
                  success: function () {
                    document.location.href = "http://localhost:8000/confirmation?id=" + idOrder;
                  }
                });
              }
            }
          });
        })
      });
    }
  });

  $.validator.addMethod("creditcardexpiry", function (value, element) {
    // allow any non-whitespace characters as the host part
    return this.optional(element) || /^(0[1-9]|1[0-2])\/\d{2}$/.test(value);
  }, "La date d\'expiration de votre carte de crédit est invalide.");

  validator.form();
});
