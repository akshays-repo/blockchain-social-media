var express = require('express');
var router = express.Router();
const cryptoUtils = require('../cryptolib/cryptoUtils')
var Nedb = require('nedb')
var db = new Nedb({ filename: 'data.db', autoload: true });
var sha256 = require('js-sha256')


var genesisBlock = function () {
  var block = {
    index: 0,
    previousHash: "none",
    timestamp: Math.floor(new Date() / 1000),
    data: "The origin of Blocknet",
    blockHash: sha256(Math.floor(new Date() / 1000) + "The origin of BlockNet")
  }
  db.insert(block)
}

db.findOne({}, function (err, docs) {
  if (docs != null) {
    console.log('genesis block found')
  } else {
    console.log('genesis block not found')
    genesisBlock()
  }
});

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('backend');
});

router.post('/postdata', function (req, res, next) {
  db.find({}).sort({timestamp: -1}).limit(1).exec((err, docs)=>{
    var doc=docs[0]
    console.log(doc)
      var index = doc.index+1;
      var previousHash = doc.blockHash;
      var timestamp = Math.floor(new Date() / 1000)
      var data = req.body;
      var block = {
        index,
        timestamp,
        data,
        blockHash: sha256(index + previousHash + timestamp + JSON.stringify(data))
      }

      db.insert(block)
      res.json({ status: 1 })
    })
});
router.post('/postimagedata', function (req, res, next) {

  db.find({}).sort({timestamp: -1}).limit(1).exec((err, docs)=>{
    var doc=docs[0]
    console.log(doc)
      var index = doc.index+1;
      var previousHash = doc.blockHash;
      var timestamp = Math.floor(new Date() / 1000)
      var data = req.body;
      var block = {
        index,
        timestamp,
        data,
        blockHash: sha256(index + previousHash + timestamp + JSON.stringify(data))
      }

      db.insert(block)
      res.json({ status: 1 })
    })
})

router.get('/getblockchain', function (req, res, next) {
  db.find({}).sort({timestamp: -1}).exec((err, docs)=>{
    res.json(docs);
})
});

module.exports = router;
