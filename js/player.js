Player = function(nickName) {

	var _nick = nickName;
	var _secret = Math.ceil(Math.random()*9999999);
	var _hand = null;
	var _buffer = [];
	var _rule = [];
	var _points = 0;

function bufferResponse(response) {
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
