var orderRequest;

$(document).ready(function () {
    var order;
    var id;
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('=');
    id = sURLVariables[1];

    orderRequest = "http://localhost:8000/api/order/" + id;

    console.log("|REQUEST| : " + orderRequest);

    getOrder();
});

function getOrder() {
    console.log(orderRequest);

    $.getJSON(orderRequest, function (data) {
        order = data[0];
        console.log(order);
    }).done(function () {
        var numCommande = " " + order.id;
        var user = " " + order.firstName + " " + order.lastName;

        $("#confirmation-number").html(numCommande);
        $("#name").html(user);
    });
}