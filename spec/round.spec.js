round = require('../js/round.js');
describe("round", function() {

    it("should exist", function() {
        var result = round;
        expect(result).toBeDefined();
    });

    it("starting a round should yield zero players", function() {
    	var myRound = round;
        myRound.start([]);
	expect(myRound.getPlayers().length).toEqual(0);
    });



});
