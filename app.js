var express = require("express");
var app = express();
var router = express.Router();
var port = process.env.PORT || 8080;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
mongo = require('mongodb');
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var request = require('request');
var bodyParser = require("body-parser");

var MongoClient = require("mongodb").MongoClient
var db;
var users;
var products;
var categories;

app.use(bodyParser.json());

MongoClient.connect("mongodb://miru:toor@ds021333.mlab.com:21333/heroku_b9f5wv05", function(err, database) {
  if(err) throw err;
  db = database;
  users = db.collection("Users");
  products = db.collection("Products");
  categories = db.collection("Categories");
});

app.get("/main",function(req,res){
    res.json({"message" : "Hello World!"});
});

//add product
app.post('/api/add_product', function(req, res) {
    var producer = req.body.producer;
    var model = req.body.model;
    var osys = req.body.osys;
    var quantity = req.body.quantity;
    var price = req.body.price;

        products.find().sort({_id:-1}).toArray(function (err, items) {
            var x = items[0]["id"];
            products.insert({id:x+1,producer:producer, model: model, osys: osys, quantity:quantity, price:price});
            res.send("ok");
        });
})

//get products
app.get('/api/products', function(req, res) {

        res.contentType('application/json');
        products.aggregate([
            {
            '$group': {
            '_id' : '$_id',
                'item':
                {'$push':
                 {
                   'id':'$id',
                    'producer':'$producer',
                     'model': '$model',
                     'osys': '$osys',
                     'quantity': '$quantity',
                     'price': '$price'
                 }
                }
             }
            }
        ]).toArray(function (err, items) {
            console.log(items);
            res.send(JSON.stringify(items));
        });
});

//buy product
app.post('/api/buy', function(req, res) {
    var id = req.param('id');
      products.find().sort({_id:-1}).toArray(function (err, items) {
            var x = items[0]["quantity"];
            products.update({'_id' : new ObjectId(id)}, { $set: { quantity:quantity:x--}});
        res.send("ok");
        });
       
})


app.listen(port);
