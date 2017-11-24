var totalQuantity = 0;

$(document).ready(function () {
  var nbProduit;

  entete();

  function entete() {

    calculTotalQuantity(function () {
      if (totalQuantity > 0) {
        $('span.count').show();
        $('span.count').html(totalQuantity);
      }
      else {
        $('span.count').hide();
      }
    });
  }
});

function calculTotalQuantity(callback) {

  totalQuantity = 0;
  /* Calculates the quantity of items in the shopping-cart */
  var totalQuantityRequest = "http://localhost:8000/api/shopping-cart/";
  $.getJSON(totalQuantityRequest, function (data) {
    $.each(data, function (key, val) {
      totalQuantity += parseInt(val.quantity.toString());
    });
  }).done(function () {
    callback();
  });

}
