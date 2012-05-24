/**
* TODO
* - the nickname/session is lost after a round
* - the points need to be added to a leaderboard
* - layout needs to be done
* - check if the winnings are handled correctly. I've seen weird results.
* - on exit, the player should be removed from the game. onunload?
*/
var http = require('http');
var fs = require('fs');
var roundNr = 1;
var roundInterval = setInterval(function() { 
	console.log("finishing current round");
	currentRound.finishRound();
	roundNr++; 
	currentRound = new Round(currentRound.getPlayers(), roundNr);
	console.log('Round '+roundNr+' started');
}, 30000);
var currentRound = new Round([], roundNr);
var rules = [
   		['scissors', 'cuts', 'paper'], 
		['paper', 'covers', 'rock'], 
		['rock', 'crushes', 'lizard'], 
		['lizard', 'poisons', 'spock'], 
		['spock', 'smashes', 'scissors'], 
		['scissors', 'decapitates', 'lizard'], 
		['lizard', 'eats', 'paper'], 
		['paper', 'disproves', 'spock'], 
		['spock', 'vaporizes', 'rock'], 
		['rock', 'crushes', 'scissors']
];
http.createServer(function (req, res) {
  try {
	  switch(req.url) {
	  	case '/':
		  	var html = fs.readFile('index.html', function (err, data) {
			    if (err) { 
		                res.writeHead('500', "{'Content-Type': 'text/html'}");
			    	res.write(err.toString());
			    }
			    res.writeHead('200', "{'Content-Type': 'text/html'}");
		  	    res.end(data);
			});
	  		break;
	  	case '/style.css':
		  	var css = fs.readFile('style.css', function (err, data) {
			    if (err) { 
		                res.writeHead('500', "{'Content-Type': 'text/css'}");
			    	res.write(err.toString());
			    }
			    res.writeHead('200', "{'Content-Type': 'text/css'}");
		  	    res.end(data);
			});
	  		break;
	  	case '/reset.css':
		  	var css = fs.readFile('reset.css', function (err, data) {
			    if (err) { 
		                res.writeHead('500', "{'Content-Type': 'text/css'}");
			    	res.write(err.toString());
			    }
			    res.writeHead('200', "{'Content-Type': 'text/css'}");
		  	    res.end(data);
			});
	  		break;
	  	default:
		  	res.writeHead('200', "{'Content-Type': 'application/json'}");
		  	var request = require('url').parse(req.url, true);
	  		switch(req.url.substr(1, 4)) {
	  			case 'auth':
				  	//res.writeHead('200', "{'Content-Type': 'application/json'}");
				  	var nickName = request.query.nick.toString();
				  	if (currentRound.playerExists(nickName)) {
				  		throw "That nickname is already taken.";
				  	} else {
					  	player = currentRound.addPlayer(nickName);
				  		res.end("Game.handleAuth("+JSON.stringify(player)+");");
				  	}
	  				break;
	  			case 'play':
	  				if (currentRound.validate(request.query)) {
	  					response = currentRound.playTurn(request.query);
				  		res.end("Game.handleTurn("+JSON.stringify(response)+");");
	  				}
	  				break;
	  			case 'rend':
	  				if (currentRound.validate(request.query)) {
	  					var response = currentRound.getLastResults();
				  		res.end("Game.handleRoundEnd("+JSON.stringify(response)+");");
	  				}
	  				break;
	  			case 'favi': // favicon.ico
	  				break;
	  			default:
	  				throw "Invalid command.";
	  				break;
	  		}
	  		break;
	  }
  } catch (e) {
  	var error = e.toString().replace(/'/g, "");
  	res.end("Game.handleError({error:'"+error+"'});");
  }
}).listen(1337, "127.0.0.1");
process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

function Round() {
	this._players = [];
	this._endTime = new Date();
	this.results = [];
	
// 	var self = this;
 	// initialize rounds
 	this.start = function(playerClients, roundNr) {
 		this._results = [];
 		this._players = [];
 		this.roundNr = roundNr;
		playerClients.forEach(function(player) {
			player.clear();
			console.log(player.nick+' was added.')
			this._players[player.nick] = player;
			player.bufferResponse("{'message':'A new round has started.'}");
	    });
 	},
 	
 	this.validate = function(params) {
		console.log(params);
		console.log(this._players);
 		if (this._players[params.nick]) {
 			var player = this._players[params.nick];
 	//		console.log(player.nick+' == '+params.nick+' && '+player.secret+' == '+params.secret);
 			if (player.nick == params.nick && player.secret == params.secret) {
			  	return true;
 			} else {
 				throw "Invalid session.";
 			}
 		} else {
			throw "Please choose a nickname first.";
 		}
 	},
 
 /*	
 	this.finish = function() {
 		this.results = [];
		var winners = [];
 		for(var nick in this._players) {
 			winners.push(this._players[nick]);
 		}
 		console.log(winners.length);
 		// order the winners
		for(y = 0; y < (winners.length-1); y++) {
	    	if (y < this._players.length-1) {
				if(winners[y+1].outranks(winners[y])) {
					var holder = winners[y+1];
					winners[y+1] = winners[y];
					winners[y] = holder;
				}
		    }
	    }
	    console.log("We have some winners! "+winners.length);
		    for(var i in winners) {
		    	console.log(i+" -> "+winners[i].nick+" played "+winners[i].hand)
		    }
			// get all rules and print them to the sockets
///*			for(x = 0; x < self.hands.length; x++) {
//		    	if (x < self.hands.length-1) {
//		    		if (self.hands[x].hand != self.hands[x+1].hand && x!=0) {
//		    			break;
//		    		}
//	    			winners.push(self.hands[x].nick);
//		    	}
//			}

		// get all rules and print them to the sockets
	    for(w = 0; w < winners.length; w++) {
	    	if (w < this._players.length-1) {
		    	var nickTop = winners[w].nick;
		    	var nickBottom = winners[w+1].nick;
	    		var rule = this.getRule(this._players[nickTop],this._players[nickBottom]);
	    		console.log(rule);
	    		this.results.push(rule);
	    	}
	    };
	   return;
   	},
*/ 	
 	this.getLastResults = function() {
 		return {'results':this.results};
 	},

	this.playTurn = function(params) {
		this._players[params.nick].hand = params.hand;
		return [
				{"message":"You played "+params.hand+"."},
				this.getTimeLeft()
			   ];
	},
	
	this.getTimeLeft = function() {
		return {"timeleft":this.calcSecondsUntilEnd()}
	},
	
	this.calcSecondsUntilEnd = function() {
		var now = new Date();
		var then = this._endTime;
		return 30-Math.floor((now-then)/1000);
	}
 	
 	this.playerExists = function(nickName) {
 	    return (this._players[nickName] instanceof Player);
 	},
 	
 	this.addPlayer = function(nickname) {
 		player = new Player(nickname);
 		this._players[nickname] = player;
 		player.bufferResponse({"message" : "Welcome to the game!"});
 		return player;
 	},
 	
 	this.getPlayers = function() {
 		return this._players;
 	},
 	
	this.getRule = function(client1, client2) {
		if (client1.hand == client2.hand) {
			return client1.hand+" equals "+client2.hand + ", a tie between "+client1.nick+" and "+client2.nick+".\n\r";
		}
		for(var i=0;i<rules.length;i++) {
			if (rules[i][0] == client1.hand && rules[i][2] == client2.hand) {
				return rules[i].join(" ") + ", " + client1.nick + " beats " +client2.nick + ".\n\r";
			}
		}
		return "";
	}

 	this.finishRound = function() {
 		var hands = [];
		// make sure all hands are set
		for(var nick in this._players) {
			if (this._players[nick].hand != null) {
				hands.push(this._players[nick]);
			}	
		}
		console.log("hands done : "+hands.length);
	    for(x = 0; x < hands.length; x++) {
			for(y = 0; y < (hands.length-1); y++) {
				if(hands[y+1].outranks(hands[y])) {
					holder = hands[y+1];
					hands[y+1] = hands[y];
					hands[y] = holder;
			    }
		    }
			// get all rules and print them to the sockets
			var winners = [];
			for(x = 0; x < hands.length; x++) {
		    	if (x < hands.length-1) {
		    		if (hands[x].hand != hands[x+1].hand && x!=0) {
		    			break;
		    		}
	    			winners.push(hands[x].nick);
	    			hands[x].addPoints(1);
		    	}
			}
			switch(winners.length) {
				case 1:
					var txt = "\n\r***** "+winners[0]+" wins! *****\n\r";
					break;
				default:
					var txt = "The winners are " + winners.join(", ")+"!\n\r";
					break;
			}
			// get all rules and print them to the sockets
		    for(x = 0; x < hands.length; x++) {
		    	if (x < hands.length-1) {
		    		txt += " - "+this.getRule(hands[x], hands[x+1]);
		    	}
		    };
		    txt += "\n\r";
		    console.log(txt);
		    hands.forEach(function(aPlayer) {
		    	aPlayer.bufferResponse(txt);
		    	// reset hands
		    	aPlayer.hand = null;
		    });
	   }
 	}
}
Player = function(nickName) {

	this.nick = nickName;
	this.secret = Math.ceil(Math.random()*9999999);
	this.hand = null;
	this.buffer = [];
	this.rule = [];
	this.points = 0;

	this.bufferResponse = function(response) {
		this.buffer.push(response);
	}

	this.addPoints = function(points) {
		this.points = this.points + points;
	}

	
	this.getHand = function() {
		return this.hand;
	}

	this.clear = function() {
		this.hand = null;
	}
	
	this.outranks = function(otherPlayer) {
		if (this.hand == false) return;
		var you_win = null;
		for(var i=0;i<rules.length;i++) {
			if (rules[i][0] == otherPlayer.hand && rules[i][2] == this.hand) {
				you_win = false;
				this.rule.push(rules[i].join(" ")); 
			} else if (rules[i][2] == otherPlayer.hand && rules[i][0] == this.hand) {
				you_win = true;
				this.rule.push(rules[i].join(" ")); 
			}
		}
		if (you_win == null) {
			this.bufferResponse("** You didn't enter a valid hand before the end of the round");
			return false;
		}
		return you_win;
	}
	
	this.getRule = function(client1, client2) {
		if (client1.hand == client2.hand) {
			return client1.hand+" equals "+client2.hand + ", a tie between "+client1.nick+" and "+client2.nick+".\n\r";
		}
		for(var i=0;i<rules.length;i++) {
			if (rules[i][0] == client1.hand && rules[i][2] == client2.hand) {
				return rules[i].join(" ") + ", " + client1.nick + " beats " +client2.nick + ".\n\r";
			}
		}
		return "";
	}	
}
