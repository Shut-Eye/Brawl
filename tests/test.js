var fs = require('fs');
'use strict';

var myCode = fs.readFileSync('./bin/server/common.js','utf-8'); // depends on the file encoding
eval(myCode);

describe("The class Vec3", function(){

	it ("exists", function(){
		expect(typeof Brawl.Vec3).toBe('function');
	});

	it ("should be True that X cross Y == Z", function(){
		var X = new Brawl.Vec3(1, 0, 0);
		var Y = new Brawl.Vec3(0, 1, 0);
		var Z = new Brawl.Vec3(0, 0, 1);

		expect(Brawl.Compare3(Brawl.CP3(X, Y), Z), .00001).toBe(true);
		expect(Brawl.Compare3(Brawl.CP3(X, X), Z), .00001).toBe(false);
	});

	it ("should be True that X dot Y == 0", function(){
		var X = new Brawl.Vec3(1, 0, 0);
		var Y = new Brawl.Vec3(0, 1, 0);
		var Z = new Brawl.Vec3(0, 0, 1);

		expect(Brawl.Dot3(X, Y) < .0000001).toBe(true);
		expect(Brawl.Dot3(X, X) < .0000001).toBe(false);
		expect(Brawl.Dot3(Y, Y) < .0000001).toBe(false);
		expect(Brawl.Dot3(Z, Z) < .0000001).toBe(false);
	});

	it ("might be True that X dot Y == 0", function(){
		var X = new Brawl.Vec3(1, 0, 0);
		var Y = new Brawl.Vec3(0, 1, 0);
		var Z = new Brawl.Vec3(0, 0, 1);

		expect(Brawl.Dot3(X, Y) === 0).toBe(true);
		expect(Brawl.Dot3(X, X) === 0).toBe(false);
	});
});