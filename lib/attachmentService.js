"use strict";

var Promise = require('bluebird');
var serviceClient = require('./serviceClient.js');

function AttachmentService(wsdl_url, username, password) {
  this._wsdl_url = wsdl_url;
  this._username = username;
  this._password = password;

  this.client = null;
}

AttachmentService.prototype.getFileAttachment = function(request) {

  var self = this;

  function getFileAttachmentPromise(request) {
    return new Promise(function(resolve, reject) {
      self.client.AttachmentService.Attachment.getFileAttachment({
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
      return getFileAttachmentPromise(request);
    });
  }
  else {
    return getFileAttachmentPromise(request);
  }
};

exports.AttachmentService = AttachmentService;
