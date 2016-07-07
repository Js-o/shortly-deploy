var path = require('path');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var Schema = mongoose.Schema;
var crypto = require('crypto');

mongoose.connect('mongodb://127.0.0.1/db');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  exports.urlSchema = new Schema({
    url: String,
    baseUrl: String,
    code: String,
    title: String,
    visits: {type: Number, default: 0},
    timestamp: {type: Date, default: Date.now }
  });

  exports.urlSchema.methods.hashCode = function() {
    var shasum = crypto.createHash('sha1');
    shasum.update(this.url);
    this.code = shasum.digest('hex').slice(0, 5);
  };

  exports.userSchema = new Schema({
    username: String,
    password: String,
    salt: String,
    urls: [urlSchema]
  });

  exports.userSchema.methods.hashPassword = function(password) {
    this.salt = new Data().valueOf();
    this.password = brcyt.hashSync(password, this.salt);
  };

  exports.userSchema.methods.comparePassword = function(attemptedPassword, callback) {
    bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
      callback(isMatch);
    });
  };


  // Kitten.find({'key': 'val'}, function (err, kittens) {
  //   if (err) { return console.error(err); }
  //   console.log(kittens);
  // });

  //fluffy.save(function (err, fluffy) {
  //   if (err) return console.error(err);
  //   fluffy.speak();
  // });

  // var knex = require('knex')({
  //   client: 'sqlite3',
  //   connection: {
  //     filename: path.join(__dirname, '../db/shortly.sqlite')
  //   },
  //   useNullAsDefault: true
  // });
  // var db = require('bookshelf')(knex);

  // db.knex.schema.hasTable('urls').then(function(exists) {
  //   if (!exists) {
  //     db.knex.schema.createTable('urls', function (link) {
  //       link.increments('id').primary();
  //       link.string('url', 255);
  //       link.string('baseUrl', 255);
  //       link.string('code', 100);
  //       link.string('title', 255);
  //       link.integer('visits');
  //       link.timestamps();
  //     }).then(function (table) {
  //       console.log('Created Table', table);
  //     });
  //   }
  // });

  // db.knex.schema.hasTable('users').then(function(exists) {
  //   if (!exists) {
  //     db.knex.schema.createTable('users', function (user) {
  //       user.increments('id').primary();
  //       user.string('username', 100).unique();
  //       user.string('password', 100);
  //       user.timestamps();
  //     }).then(function (table) {
  //       console.log('Created Table', table);
  //     });
  //   }
  // });

// module.exports = db;
});