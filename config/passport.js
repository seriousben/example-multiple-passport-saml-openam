'use strict';

const Passports = require('passports');
const Passport = require('passport').Passport;
const SamlStrategy = require('passport-saml').Strategy;

const _ = require('lodash');

const NOOP_PASSPORT = '<noop-passport>';

module.exports = function(config) {
  return new Passports({
    getConfig(req, cb) {
      const passportConfig = _.find(config.passports, (p) =>
        req.path && req.path.match(new RegExp('^/' + p.resolver.path))
      );
      if (!passportConfig) {
        console.log('No passport config for ', req.path);
        return cb(null, NOOP_PASSPORT, {
          id: NOOP_PASSPORT
        });
      }
      const id = passportConfig.resolver.path;
      return cb(null, id, {
        id,
        data: passportConfig,
      });
    },
    createInstance(options, cb) {
      var passport = new Passport();

      passport.serializeUser(function(user, done) {
        console.log(options.id, 'serializeUser', user);
        done(null, user);
      });

      passport.deserializeUser(function(user, done) {
        console.log(options.id, 'deserializeUser', user);
        done(null, user);
      });

      if (options.id === NOOP_PASSPORT) {

        return cb(null, passport);
      }

      passport.use(new SamlStrategy(options.data.config, function(profile, done) {
        console.log('Profile from Saml', profile);
        return done(null, {
          id: profile.uid,
          email: profile.email,
          displayName: profile.cn,
          firstName: profile.givenName || profile.givenname,
          lastName: profile.sn,
        });
      }));

      cb(null, passport);
    },
  });
};