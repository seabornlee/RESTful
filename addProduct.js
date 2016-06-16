var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var fs = require("fs");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.post('/', function (req, res) {
    if (isValid(req.body)) {
        console.log(req.body);
        saveProduct(req.body, function(successful, product) {
            if (successful) {
                res.status(201).json(product);
            } else {
                res.status(500);
            }
        });
    } else {
        res.sendStatus(400);
    }
});

function isValid(product) {
    return hasProperties(product) && hasRightType(product);
}

function hasProperties(product) {

    return product.hasOwnProperty("barcode") &&
        product.hasOwnProperty("name") &&
        product.hasOwnProperty("unit") &&
        product.hasOwnProperty("price");


}

function hasRightType(product) {
    return typeof product.barcode == 'string' 
        && typeof product.name == "string" 
        && typeof product.unit == "string" 
        && typeof product.price == "number";
}

function saveProduct(product, callback) {
    updateMaxId(function (successfully, id) {
        if (successfully) {
            product.id = id;
            updateProducts(product, callback);
        } else {
            callback(false);
        }
    });
}

function updateMaxId(callback) {
    readMaxId(function (successfully, id) {
        if (successfully) {
            writeMaxId(id + 1, callback);
        } else {
            callback(false);
        }
    });
}

function readMaxId(callback) {
    fs.readFile('./max-id.json', 'utf-8', function (err, fileContent) {
        if (err) {
            callback(false);
            return;
        }

        var data = JSON.parse(fileContent);
        callback(true, data.maxId);
    })
}

function writeMaxId(id, callback) {
    fs.writeFile('./max-id.json', JSON.stringify({"maxId": id}), function (err) {
        if (err) {
            callback(false);
            return;
        }

        callback(true, id);
    });
}

function updateProducts(product, callback) {
    readProducts(function(successfully, products) {
        if (successfully) {
            products.push(product);
            writeProducts(products, callback);
        } else {
            callback(false);
        }
    });
}

function readProducts(callback) {
    fs.readFile('./products.json', 'utf-8', function (err, fileContent) {
        if (err) {
            callback(false);
        } else {
            callback(true, JSON.parse(fileContent));
        }
    });
}

function writeProducts(products, callback) {
    fs.writeFile('./products.json', JSON.stringify(products), function (err) {
        if (err) {
            callback(false);
        } else {
            callback(true, products[products.length - 1]);
        }
    });
}

module.exports = router;