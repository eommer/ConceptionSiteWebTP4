var express = require("express");
var router = express.Router();

/* Get all products */
router.get("", function(req, res) {
  var category = req.param('category');
  var criteria = req.param('criteria');
  if(category != null && criteria != null)
    res.send('test api produits | '+ category +' | '+ criteria);
  else {
    res.send('test api produits');
  }
});



module.exports = router;
