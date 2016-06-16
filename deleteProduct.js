var express = require('express');
var router = express.Router();
var productUtils = require('./product-utils.js');
var fs = require("fs");

router.delete('/:id', function (req, res) {
    productUtils.deleteProduct(req.params.id, function(successfully) {
        if (successfully) {
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    });
});

module.exports = router;