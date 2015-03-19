var express = require("express");
var app = express();
var http = require("http");
var pjson = require("./package.json");
var path = require("path");
var request = require("request");
var fs = require("fs");

app.use(express.static(path.join(__dirname,"public")));

// subtract random values from this so our time values aren't massive
var appStart = Date.now();

var server = http.createServer(app).listen(3000, function()
{
	console.log("HTTP server listening.");
});

var io = require("socket.io").listen(server);

io.on("connection", function(socket)
{
	socket.on("update", function(data)
	{

	});

	// emits random input values
	// comment this out once actual data is available
	setInterval(function()
	{
		// change effect status
		var ableton = {};
		if(Math.random() > 0.5)
		{
			// example effect names
			effectNames = ["Auto Filter", "Vocoder", "Compressor", "EQ Eight"];
			myEffects = [];
			// come up with some effect
			for(i = 0; i < effectNames.length; i++)
			{
				if(Math.random() > 0.5)
				{
					myEffects.push(effectNames[i]);
				}
			}
			ableton.effectsOn = myEffects;
			ableton.effectsLoaded = effectNames;
			ableton.tempo = 120;

			//socket.emit("ableton", ableton);
		}

		// change intensity
		var crowd = {};
		if(Math.random() > 0.5)
		{
			var intensityRange;
			var intensity = Math.floor((Math.random() * 6) + 0);
			switch(intensity)
			{
				case 0:
					intensityRange = "low";
					break;
				case 1: 
					intensityRange = "medium-low";
					break;
				case 2:
					intensityRange = "medium";
					break;
				case 3:
					intensityRange = "medium-high";
					break;
				case 4:
					intensityRange = "high";
					break;
				case 5:
					intensityRange = "extreme";
					break;
				default:
					console.log("RNG error");
					break;
			}
			crowd = {intensityRange: intensityRange, intensity: intensity};
		}

		// change song
		var song = {};
		if(Math.random() < 0.1)
		{
			song = { titles: "song " + Math.random()};
		}

		socket.emit("update", {ableton: ableton, song: song, crowd: crowd, song_time: Date.now()-appStart})

	}, 1000);
});