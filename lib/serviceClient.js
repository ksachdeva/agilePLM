"use strict";

var soap = require('soap');
var Promise = require('bluebird');

function getServiceClient(wsdl_url, username, password) {
  return new Promise(function (resolve, reject) {
    soap.createClient(wsdl_url, function (err, client) {
      if (err !== null) {
        reject(err);
        return;
      }
      client.setSecurity(new soap.BasicAuthSecurity(username, password));
      resolve(client);
    });
  });
}

exports.getServiceClient = getServiceClient;
