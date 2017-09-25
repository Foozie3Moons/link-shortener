var express = require('express');
var app = express();
var db = require('./models');
var bodyParser = require('body-parser');
var path = require('path');
var Hashids = require('hashids');
var hashids = new Hashids('matthew-bell/link-shortener');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.set('view options', {
  layout: false // pug has default layout functionality
});

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('morgan')('dev'));

app.get('/', function(req, res) {
  // contains a simple form where the user can enter a url and get a short url
  res.render('index');
});

app.post('/links', function(req, res) {
  // accepts data from the form. stores the url in the database and redirects to the show route.
  db.link.findOrCreate({
    where: {
      url: req.body.url
    }
  }).then(function(link) {
    res.redirect('/links/' + link[0].id);
  });
});

app.get('/links/:id', function(req, res) {
  // displays the short url of the specified id (so the user can copy / share it)
  db.link.find({
    where: {
      id: req.params.id
    }
  }).then(function(link) {
    var id = link.id
    var hash = hashids.encode(id);
    var url = 'localhost:3000/' + hash;
    res.render('show', {
      link: {
        hash: hash,
        hashedUrl: url
      }
    });
  });
});

app.get('/:hash', function(req, res) {
  // takes the hash and redirects the user to the url stored in the database.
  var id = hashids.decode(req.params.hash);
  db.link.find({
    where: {
      id: id
    }
  }).then(function(link) {
    console.log(link.url);
    res.redirect(link.url);
  });
});

app.get('/links', function(req, res) {

});

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
