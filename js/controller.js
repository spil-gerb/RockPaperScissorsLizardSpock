Controller = function(gameHandler) {

    this._req = null;
    this._res = null;
    this._gameHandler = gameHandler;

    this.route = function(req, res) {
	try {
	    switch(req.url) {
	  	case '/':
		    req.url = '/index.html';
		case '/index.html':
  		case '/reset.css':
		case '/style.css':
		    this._processResource(req.url.substr(1), res);
		    break;
	        default: 
 	            var command = req.url.substr(0, req.url.substr(1).indexOf("/")+1);
		    var gameHandler = new game.Handler();
	            console.log("Command received : " + req.url + "." + command);	
		    res.writeHead('200', "{'Content-Type': 'text/html'}");
	            res.end('true');
	            break;
	        }
  	} catch (e) {
  	    var error = e.toString().replace(/'/g, "");
	    console.log(error);
  	    res.end("Game.handleError({error:'"+error+"'});");
 	}
    }

    this._processResource = function(filePath, res) {
        var fs = require('fs');
        var data = fs.readFile('./resources/'+filePath, function (err, data) {
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
