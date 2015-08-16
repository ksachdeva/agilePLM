"use strict";

var Promise = require('bluebird');
var serviceClient = require('./serviceClient.js');

function SearchService(wsdl_url, username, password) {
  this._wsdl_url = wsdl_url;
  this._username = username;
  this._password = password;

  this.client = null;
}

SearchService.prototype.quickSearch = function(request) {

  var self = this;

  function quickSearchPromise(request) {
    return new Promise(function(resolve, reject) {
      self.client.SearchService.Search.quickSearch({
        'request': request
      }, function (err, result, body) {
        if (err !== null) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }

  if (this.client === null) {
    return serviceClient.getServiceClient(this._wsdl_url, this._username, this._password).then(function(client) {
      self.client = client;
      return quickSearchPromise(request);
    });
  }
  else {
    return quickSearchPromise(request);
  }
};


SearchService.prototype.advancedSearch = function(request) {

  var self = this;

  function advancedSearchPromise(request) {
    return new Promise(function(resolve, reject) {
      self.client.SearchService.Search.advancedSearch({
        'request': request
      }, function (err, result, body) {
        if (err !== null) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }

  if (this.client === null) {
    return serviceClient.getServiceClient(this._wsdl_url, this._username, this._password).then(function(client) {
      self.client = client;
      return advancedSearchPromise(request);
    });
  }
  else {
    return advancedSearchPromise(request);
  }
};

exports.SearchService = SearchService;
