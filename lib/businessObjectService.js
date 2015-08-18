"use strict";

var soap = require("soap");
var Promise = require('bluebird');
var serviceClient = require('./serviceClient.js');

function BusinessObjectService(wsdl_url, username, password) {
  this._wsdl_url = wsdl_url;
  this._username = username;
  this._password = password;

  this.client = null;
}

BusinessObjectService.prototype.setPatchResponseCallBack = function(cb) {
  this._cb = cb;
};

BusinessObjectService.prototype.getObject = function(request) {

  var self = this;

  function getObjectPromise(request) {

    if (self._cb !== null) {
      self._orginalResponse = soap.HttpClient.prototype.handleResponse;
      soap.HttpClient.prototype.handleResponse = self._cb;
    }

    return new Promise(function(resolve, reject) {
      self.client.BusinessObjectService.BusinessObject.getObject({
        'request': request
      }, function (err, result, body) {
        if (self._cb !== null) {
          // put back the original handleResponse
          soap.HttpClient.prototype.handleResponse = self._orginalResponse;
        }
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
      return getObjectPromise(request);
    });
  }
  else {
    return getObjectPromise(request);
  }
};

exports.BusinessObjectService = BusinessObjectService;
