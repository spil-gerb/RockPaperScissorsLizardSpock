Controller = function() {

    this._req = null;
    this._res = null;

    this.route = function(req, res) {
	try {
	    switch(req.url) {
	  	case '/':
		    req.url = '/index.html';
		case '/style.css':
  		case '/reset.css':
		    this._processResource(req.url.substr(1), res);
		    break;
	        default: 
 	            res.writeHead('200', "{'Content-Type': 'text/html'}");
	            res.end(data);
	            break;
	        }
  	} catch (e) {
  	    var error = e.toString().replace(/'/g, "");
  	    res.end("Game.handleError({error:'"+error+"'});");
 	}
    }

    this._processResource = function(filePath, res) {
        var fs = require('fs');
        var data = fs.readFile(filePath, function (err, data) {
	    if (err) { 
                res.writeHead('500', "{'Content-Type': 'text/html'}");
	    	res.write(err.toString());
	    }
	    res.writeHead('200', "{'Content-Type': 'text/html'}");
	    res.end(data);
	});
    }

}

exports.Controller = Controller;
