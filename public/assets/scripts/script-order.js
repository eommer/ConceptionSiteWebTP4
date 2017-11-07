$(document).ready(function() {
  var validator = $("#order-form").validate({
    rules : {
      firstname: {
        required : true,
        minlength : 2
      },
      lastname: {
        required : true,
        minlength : 2
      },
      email: {
        required : true,
        email : true
      },
      phone: {
        required : true,
        phoneUS : true
      },
      creditcard: {
        required : true,
        creditcard : true
      },
      creditcardexpiry: {
        required : true,
        creditcardexpiry : true
      },
    },
    messages : {
    },
    submitHandler: function() {
      console.log("onClickValidate");
      var nbCommande = JSON.parse(localStorage.getItem(-1));

      localStorage.clear();

      console.log("firstname value : " + $("#first-name").val());
      //Sauvegarde du nom et du prénom de l'utilisateur en localStorage
      localStorage.setItem(-2, JSON.stringify({firstname : $("#first-name").val(), lastname : $("#last-name").val()}));

      //Sauvegarde du numéro de commande dans le localStorage
      if(nbCommande != null){
        nbCommande ++;
        localStorage.setItem(-1, JSON.stringify(nbCommande));
      }
      else{
        nbCommande = 1
        localStorage.setItem(-1, JSON.stringify(nbCommande));
      }

      console.log("nbCommande : " + nbCommande);

      $("#order-form").ajaxSubmit();
    }
  });

  $.validator.addMethod("creditcardexpiry", function(value, element) {
    // allow any non-whitespace characters as the host part
    return this.optional( element ) || /^(0[1-9]|1[0-2])\/\d{2}$/.test( value );
  }, "La date d\'expiration de votre carte de crédit est invalide.");

  validator.form();
});
