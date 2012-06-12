var round = function() {

};


exports.round = round;
var _players = [];

function start(players) {
	_players = players;
}

function getPlayers() {
	return _players;
}

exports.start = start;
exports.getPlayers = getPlayers;
