'use strict';

var validator = require('validator'),
  path = require('path'),
  config = require(path.resolve('./config/config'));

var parseUrl = require('url').parse;
var formatUrl = require('url').format;
var rp = require('request-promise');
var requestProxy = require('express-request-proxy');


/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {

  // append '/' --if not
  if(!req.path.endsWith('/')){
    var url = parseUrl(req.url);
    url.pathname = url.pathname + '/';
    var newUrl = formatUrl(url);

    return res.redirect(301, newUrl);
  }

  
  var safeUserObject = null;
  if (req.user) {
    safeUserObject = {
      displayName: validator.escape(req.user.displayName),
      provider: validator.escape(req.user.provider),
      username: validator.escape(req.user.username),
      created: req.user.created.toString(),
      roles: req.user.roles,
      profileImageURL: req.user.profileImageURL,
      email: validator.escape(req.user.email),
      lastName: validator.escape(req.user.lastName),
      firstName: validator.escape(req.user.firstName),
      additionalProvidersData: req.user.additionalProvidersData
    };
  }

  res.render('modules/core/server/views/index', {
    user: JSON.stringify(safeUserObject),
    sharedConfig: JSON.stringify(config.shared)
  });
};


/**
 * Render the main application page
 */
exports.renderMicroAppIndex = function (req, res) {

  console.log('-------------------renderMicroAppIndex---------------------');

  // Micro Apps Configuration::
  var mappsConfigured = [{id:'mapp1', name:'Micro App1'}, {id:'mapp2', name:'Micro App2'}];

  // append '/' --if not
  if(!req.path.endsWith('/')){
    var url = parseUrl(req.url);
    url.pathname = url.pathname + '/';
    var newUrl = formatUrl(url);

    return res.redirect(301, newUrl);
  }






  // Common:
  var safeUserObject = null;
  
  if (req.user) {
    safeUserObject = {
      displayName: validator.escape(req.user.displayName),
      provider: validator.escape(req.user.provider),
      username: validator.escape(req.user.username),
      created: req.user.created.toString(),
      roles: req.user.roles,
      profileImageURL: req.user.profileImageURL,
      email: validator.escape(req.user.email),
      lastName: validator.escape(req.user.lastName),
      firstName: validator.escape(req.user.firstName),
      additionalProvidersData: req.user.additionalProvidersData
    };
  }

  res.render('modules/core/server/views/mappindex', {
    user: JSON.stringify(safeUserObject),
    sharedConfig: JSON.stringify(config.shared)
  });


};


exports.proxyAllMicroAppRequest = function (req, res, next) {

  console.log('-------------------proxyAllMicroAppRequest---------------------');

  var options = {
    uri: 'http://localhost:7001'+ '/*',
    timeout: 10000,
    headers: customHeader,
    originalQuery: req.originalUrl.indexOf('?') >= 0
  };

  // requestProxy(options)(req, res, next);

};



/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};
