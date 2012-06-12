var cliArgs = process.argv.splice(2);
var http = require('http');
var fs = require('fs');
listenPort = parseInt(cliArgs[0], 10);
if (isNaN(listenPort)) {
    console.log('No proper port given. please specify a port as a parameter.');
    exit();	
} 
console.log(listenPort);
control = require('../js/controller.js');
var crl = new control.Controller();
function dealWithRequest(request, response) {
    crl.route(request, response);
}

http.createServer(dealWithRequest).listen(listenPort);
