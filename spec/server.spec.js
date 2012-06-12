server = require('../js/server.js');
describe("Teh Server", function() {

    it("should exist", function() {
        var result = server;
        expect(result).toBeDefined();
    });

/*    it("starting a round should yield zero players", function() {
    	var myRound = round;
        myRound.start([]);
	expect(myRound.getPlayers().length).toEqual(0);
    });
*/


});
