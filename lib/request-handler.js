var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');
var Users = require('../app/collections/users');
var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};
//edit
exports.fetchLinks = function(req, res) {
  // Links.reset().fetch().then(function(links) {
  //   res.status(200).send(links.models);
  // });
  db.userSchema.find({username: req.session.user }, function(err, user) {
    if (err) { throw err; }
    user.urls.find(function(err, urls) {
      res.status(200).send(urls);
    });
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }
  //edit
  //use find to see if url is found
    //if found we will return the found url
    //else we will make the url
      //and add to users url list


  db.urlSchema.find({urls: uri}, function(err, urls) {
    if (urls) {
      console.log('saveLink urls', urls);
      res.status(200).send(urls[0]);
    } else {
      util.getUrlTitl(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }
        newUrl = new db.urlSchema({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        });
        newUrl.save(function(err, url) {
          if (err) {
            console.log('Error reading URL heading: ', err);
            return res.sendStatus(404);
          }
          res.status(200).send(url);
        });
      });
    }
  });

  // new Link({ url: uri }).fetch().then(function(found) {
  //   if (found) {
  //     res.status(200).send(found.attributes);
  //   } else {
  //     util.getUrlTitle(uri, function(err, title) {
  //       if (err) {
  //         console.log('Error reading URL heading: ', err);
  //         return res.sendStatus(404);
  //       }
  //       var newLink = new Link({
  //         url: uri,
  //         title: title,
  //         baseUrl: req.headers.origin
  //       });
  //       newLink.save().then(function(newLink) {
  //         Links.add(newLink);
  //         res.status(200).send(newLink);
  //       });
  //     });
  //   }
  // });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  //edit

  //check database if user exists
    //if the user doesnt exist, redirect to login
    //otherwise compare the users password in database
      //if match create session
      //else no match, redirect
  db.userSchema.find({username: req.body.username}, function(err, user) {
    if (!user) {
      res.redirect('/login');
    } else {
      user.comparePassword(password, function(match) {
        if (match) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      });
    }
  });

  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       res.redirect('/login');
  //     } else {
  //       user.comparePassword(password, function(match) {
  //         if (match) {
  //           util.createSession(req, res, user);
  //         } else {
  //           res.redirect('/login');
  //         }
  //       });
  //     }
  //   });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  //edit

  //check database first if user exists
    //if not, create a new user
      //hash the password
    //else, redirect to signup
  
  db.userSchema.find({username: username}, function(err, user) {
    if (!user) {
      console.log('signupUser user', user);
      var newUser = new db.userSchema({
        username: username,
        password: password
      });
      db.userSchema.save(function(err, newUser) {
        if (err) { return console.error(err); }
        util.createSession(req, res, newUser);
      });
    } else {
      console.log('Account already exists');
      res.redirect('/signup');
    }
  });


  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       var newUser = new User({
  //         username: username,
  //         password: password
  //       });
  //       newUser.save()
  //         .then(function(newUser) {
  //           Users.add(newUser);
  //           util.createSession(req, res, newUser);
  //         });
  //     } else {
  //       console.log('Account already exists');
  //       res.redirect('/signup');
  //     }
  //   });
};

//edit 

//go into the users url in database
//fetch the request of the url
//visits++
//redirect to url
exports.navToLink = function(req, res) {

  db.urlSchema.find({code: req.params[0] })


  new Link({ code: req.params[0] }).fetch().then(function(link) {
    if (!link) {
      res.redirect('/');
    } else {
      link.set({ visits: link.get('visits') + 1 })
        .save()
        .then(function() {
          return res.redirect(link.get('url'));
        });
    }
  });
};