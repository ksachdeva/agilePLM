"use strict";

var Promise = require('bluebird');
var serviceClient = require('./serviceClient.js');

function TableService(wsdl_url, username, password) {
  this._wsdl_url = wsdl_url;
  this._username = username;
  this._password = password;

  this.client = null;
}

TableService.prototype.loadTable = function (request) {

  var self = this;

  function loadTablePromise(request) {
    return new Promise(function (resolve, reject) {

      self.client.TableService.Table.loadTable({
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
    return serviceClient.getServiceClient(this._wsdl_url, this._username, this._password).then(function (client) {
      self.client = client;
      return loadTablePromise(request);
    });
  } else {
    return loadTablePromise(request);
  }
};

exports.TableService = TableService;
