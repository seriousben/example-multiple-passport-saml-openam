'use strict';

const _ = require('lodash');

function buildSamlPassport(path, idpOptions) {
  return {
    resolver: {
      path,
    },
    config: _.merge({
      callbackUrl: `http://sp.example.com:${process.env.PORT || 3000}/${path}/login/callback`,
      issuer: `http://sp.example.com:${process.env.PORT || 3000}/${path}/metadata.xml`,
    }, idpOptions || {}),
  };
}

module.exports = {
  development: {
    app: {
      name: 'Passport SAML strategy example',
      port: process.env.PORT || 3000,
    },
    passports: [
      buildSamlPassport('auth1', {
        entryPoint: 'http://idp1.example.com:8080/openam/SSORedirect/metaAlias/idp',
      }),
      buildSamlPassport('auth2', {
        entryPoint: 'http://idp2.example.com:8081/openam/SSORedirect/metaAlias/idp',
      }),
    ],
  }
};