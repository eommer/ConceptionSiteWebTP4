var orderRequest;

$(document).ready(function () {
    var order;
    var id;
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('=');
    id = sURLVariables[1];

    orderRequest = "http://localhost:8000/api/orders/" + id;

    getOrder();
});

function getOrder() {
    $.getJSON(orderRequest, function (data) {
        order = data;
    }).done(function () {
        var numCommande = " " + order.id;
        var user = " " + order.firstName + " " + order.lastName;

        $("#confirmation-number").html(numCommande);
        $("#name").html(user);
    });
}
