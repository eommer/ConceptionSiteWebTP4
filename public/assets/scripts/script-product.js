$(document).ready(function() {
    if(typeof localStorage!='undefined') {
        //Récupère l'id passé en paramètre dans l'url
        function GetURLParameter(sParam){
            var sPageURL = window.location.search.substring(1);
            var sURLVariables = sPageURL.split('&');
            for(var i=0; i<sURLVariables.length; i++){
                var sParameterName = sURLVariables[i].split('=');
                if(sParameterName[0] == sParam){
                    return sParameterName[1];
                }
            }
        }

        //Rempli la page html avec les informations dans le fichier Json products.json
        $.getJSON( "./data/products.json", function( data ) {
            var isFound = false;
            actualProductId = GetURLParameter("id");
            $.each( data, function( key, val ) {
                if(val.id == actualProductId){
                    actualProduct = val;
                    let price = ((actualProduct.price).toString()).split(".")[0].toString() + "," + ((actualProduct.price).toString()).split(".")[1].toString();
                    $('#product-name').html(val.name);
                    $('#product-image').attr('src', "./assets/img/" + val.image);
                    $('#product-desc').html(val.description);

                    for(var i=0; i< val.features.length; i++){
                        $('#product-features').append('<li>' + val.features[i] + '</li>');
                    }

                    $('#product-price').html(price + "$");

                    //Rempli la quantité si ce produit est déjà dans le panier
                    var productAct = JSON.parse(localStorage.getItem(actualProductId))
                    if(productAct != null){
                        $('.form-control').attr('value', productAct.quantity);
                    }
                    isFound = true;
                }
            })

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
                //Stockage dans le local storage
                localStorage.setItem(actualProduct.id, JSON.stringify({id : actualProduct.id, name : actualProduct.name, price : actualProduct.price, quantity : $('.form-control').val()}));

                //To calculate the quantity
                var totalQuantity = 0;
                $.each(localStorage, function(index, value){
                    if((index != -1) && (index != -2)){
                        let product = JSON.parse(localStorage.getItem(index));
                        console.log("actual product : " + product.name);
                        totalQuantity = parseInt(totalQuantity) + parseInt(product.quantity);
                    }
                });
                $('span.count').show();
                $('span.count').html(totalQuantity);

                //alert('Added to order : \n' + actualProduct.name + '\n With the quantity : ' + $('.form-control').val());
                //console.log(lstShopProducts);
                $('#dialog').slideUp( 300 ).delay( 0 ).fadeIn( 200 );
                $('#dialog').slideDown( 300 ).delay( 4500 ).fadeOut( 300 );
            }
            else{
                alert("Attention la quantité doit être supérieure à 0");
            }
        });
    }
    else{
        alert("localStorage n'est pas supporté");
    }
});
