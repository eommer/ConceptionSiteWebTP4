
var totalQuantity = 0;
var quantityProduct = 1;
var isProductInCart = false;

$(document).ready(function() {



  var id;
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('=');
  id = sURLVariables[1];

  var getProductRequest = "http://localhost:8000/api/products/"+id;

  console.log("|REQUEST GET PRODUCT| " +getProductRequest);

  //Rempli la page html avec les informations dans le fichier Json products.json
  $.getJSON( getProductRequest, function( data ) {
      var isFound = true;
      var val = data;
      var actualProduct = val;
      let price = ((actualProduct.price).toString()).split(".")[0].toString() + "," + ((actualProduct.price).toString()).split(".")[1].toString();
      $('#product-name').html(val.name);
      $('#product-image').attr('src', "./assets/img/" + val.image);
      $('#product-desc').html(val.description);

      for(var i=0; i< val.features.length; i++){
          $('#product-features').append('<li>' + val.features[i] + '</li>');
      }

      $('#product-price').html(price + "$");

      getQuantityProduct(id, function(){
        ////// TODO récupère quantité du panier
        //Rempli la quantité si ce produit est déjà dans le panier
        $('.form-control').attr('value', quantityProduct);
      });

      // Si l'élément n'a pas été trouvé dans le fichier jsons
      //(<=> l'id envoyé dans l'url ne correspond à aucun produit présent dans le fichier json)
      if(!isFound){
          $('main').empty();
          $('header').after('<main><h1>Page non trouvée!</h1></main>');
      }

  });


  //Gestion du clic sur le bouton
  $('#add-to-cart-form').submit(function(e){


      //Évite de recharger la page
      e.preventDefault();

      if($('.form-control').val() > 0){

        var quantity = $('.form-control').val();

        postProduct(id, quantity, function(){

          console.log("POST SUCCED");

          ///// VERRIF test
          $.getJSON( "http://localhost:8000/api/shopping-cart/" , function( data ) {
            //Si ce produit est déja dans le panier
            $.each( data, function( key, val ) {
              console.log("id : " + val.id + " | quantity : " + val.quantity);
            });
          });

          calculTotalQuantity(function(){

            $('span.count').show();
            $('span.count').html(totalQuantity);

            //alert('Added to order : \n' + actualProduct.name + '\n With the quantity : ' + $('.form-control').val());
            //console.log(lstShopProducts);
            $('#dialog').slideUp( 300 ).delay( 0 ).fadeIn( 200 );
            $('#dialog').slideDown( 300 ).delay( 4500 ).fadeOut( 300 );


          });

        });

      }
      else{
          alert("Attention la quantité doit être supérieure à 0");
      }
  });

});

function getQuantityProduct(id, callback){

  var getQuantityRequest = "http://localhost:8000/api/shopping-cart/"+id;
  console.log("quantity request : " + getQuantityRequest);
  $.getJSON( getQuantityRequest, function( data ) {
    //Si ce produit est déja dans le panier
    console.log("QUANTITY || id : " + data.id + " | quantity : " + data.quantity);
    quantityProduct = data.quantity;
  }).done(function(){
      callback();
  });

}

function postProduct(idToPost, quantity, callback){

  console.log("id to post : " + idToPost);

  checkProductInCart(idToPost, function(){

    /* IF NOT ALREADY IN CART */
    if(!isProductInCart){
      console.log("post");
      jQuery.ajax({
        url : "http://localhost:8000/api/shopping-cart/",
        type : "POST",
        data : JSON.stringify({id : idToPost, quantity : quantity}),
        contentType : "application/json"
      }).done(function(){
          callback();
      });
    }
    /* IF ALREADY IN CART */
    else{
      console.log("put");
      jQuery.ajax({
        url : "http://localhost:8000/api/shopping-cart/",
        type : "PUT",
        data : JSON.stringify({id : idToPost, quantity : quantity}),
        contentType : "application/json"
      }).done(function(){
          callback();
      });
    }

  });

}

function calculTotalQuantity(callback){

  totalQuantity = 0;
  /* Calculates the quantity of items in the shopping-cart */
  var totalQuantityRequest = "http://localhost:8000/api/shopping-cart/";
  $.getJSON( totalQuantityRequest , function( data ) {
    $.each( data, function( key, val ) {
      console.log("quantity added : " + val.quantity);
      totalQuantity += parseInt(val.quantity.toString());
    });
  }).done(function(){
      console.log("total quantity : " + totalQuantity);
      callback();
  });

}

function checkProductInCart(id, callback){

  var getExistingRequest = "http://localhost:8000/api/shopping-cart/"+id;
  console.log("existing request : " + getExistingRequest);
  $.getJSON( getExistingRequest, function( data ) {
    console.log("existing data : " + data);

  })
  .done(function(){ isProductInCart = true; callback();})
  .fail(function(){ isProductInCart = false; callback();})
}
