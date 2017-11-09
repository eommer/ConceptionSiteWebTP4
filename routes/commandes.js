var express = require("express");
var router = express.Router();

router.get("/", function(req, res) {
  res.send('test api commandes');
});


module.exports = router;
