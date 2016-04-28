'use strict';

const _ = require('lodash');
const express = require('express');

module.exports = function(config, passports) {
  const router = express.Router();

  router.get('/', function(req, res) {
    if (req.isAuthenticated()) {
      res.render('home', {
        user: req.user
      });
    } else {
      res.render('home', {
        user: null
      });
    }
  });

  _.forEach(config.passports, (passportConfig) => {
    router.get(`/${passportConfig.resolver.path}/login`,
      passports.middleware('authenticate', 'saml', {
        successRedirect: '/',
        failureRedirect: '/login',
      })
    );

    router.post(`/${passportConfig.resolver.path}/login/callback`,
      passports.middleware('authenticate', 'saml', {
        failureRedirect: '/',
        failureFlash: true
      }),
      function(req, res) {
        res.redirect('/');
      }
    );

    router.get(`/${passportConfig.resolver.path}/metadata.xml`, function(req, res) {
      res.type('application/xml');
      res.send(req.passport._strategy('saml').generateServiceProviderMetadata());
    });
  });

  router.get('/profile', function(req, res) {
    if (req.isAuthenticated()) {
      res.render('profile', {
        user: req.user
      });
    } else {
      res.redirect('/login');
    }
  });

  router.get('/logout', function(req, res) {
    req.logout();
    // TODO: invalidate session on IP
    res.redirect('/');
  });



  return router;
};