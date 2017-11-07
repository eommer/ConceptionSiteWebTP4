$(document).ready(function() {
    var nbProduit;

    entete();

    function entete(){
        if(typeof localStorage!='undefined') {
            var count = 0;
            if(localStorage.getItem(-1) != null){
                count++;
            }
            if(localStorage.getItem(-2) != null){
                count++;
            }

            console.log("count number : " + count);
            if(localStorage.length - count === 0){
                $('span.count').hide();
            }
            else{

                //To calculate the quantity
                var totalQuantity = 0;
                $.each(localStorage, function(index, value){
                    if((index != -1) && (index != -2)){
                        let product = JSON.parse(localStorage.getItem(index));
                        totalQuantity = parseInt(totalQuantity) + parseInt(product.quantity);
                    }
                });
                
                $('span.count').show();
                $('span.count').html(totalQuantity);
            }
        }
        else {
            alert("localStorage n'est pas supporté");
        }
    }
});

