---
title: 'Quick Script: Check a ServiceNow Instance Build Tag'
description: 'A simple Node.js script to grab the build tag from any ServiceNow instance.'
date: '2019-04-15'
tags:
  - servicenow
  - nodejs
  - script
redirectFrom:
  - /servicenow-instance-build-tag/
  - /p/2019-04-15-instance-info/
---

I needed a quick way to check what build a ServiceNow instance was running. Here is the Node.js script I put together.

## The script

```javascript
module.exports = {
  getBuildTag: function(instance){
    return getBuildTag(instance);
  },
  test: function(instance){
    return getBuildTag(instance)
  }
};
function getBuildTag(instance) {
  var returnStr;
  if (instance) {
    var https = require('https');
    var url = require('url');
    var address = 'https://' + instance + '.service-now.com/InstanceInfo.do?SOAP';
    var options = { host: urlObj.host, path: urlObj.path, method: 'POST' };
    var req = https.request(options, function (response) {
      var body = [];
      response.on('data', function (data) { body.push(data); });
      response.on('end', function () {
        body = body.toString();
        if (body.indexOf('<html>') === -1) {
          returnStr = body.split('<build_tag>')[1].split('</')[0];
        } else {
          returnStr = 'Not an instance';
        }
      });
    });
    req.on('error', function (e) { console.error(e); });
    req.end();
  } else {
    returnStr = 'Needs an argument for an instance name';
  }
  return returnStr;
}
```

## Usage

```javascript
var info = require('instance-info');
info.getBuildTag('myinstance');
```

It sends a SOAP request to the InstanceInfo endpoint and parses the build_tag element from the response.
