$(function()
{
	var socket = io('http://localhost:3000');

	var chart = c3.generate({
	bindto: "#intensityGraph",
		data: {
			x: "Time",
			columns: [
				['Time'],
				['Intensity']
			],
			types: {
				Intensity: 'spline'
			}
		},
		axis: {
			x: {
				type: "timeseries"
			},
			y: {
				max: 6,
				min: 6
			}
		}
	});

	socket.on("ableton", function(data)
	{
		console.log("Ableton data:");
		console.dir(data);
		$("#currentEffects").text(data.effectsOn);

		// load effects
		var effectColumns = [];
		for(i = 0; i < data.effectsLoaded.length; i++)
		{
			if(data.effectsOn.indexOf(data.effectsLoaded[i]) == -1)
			{
				// effect channel not turned on
				effectColumns.push([data.effectsLoaded[i], 0]);
			}
			else
			{
				// channel is turned on
				effectColumns.push([data.effectsLoaded[i], 1]);
			}
		}

		effectColumns.push(["Time", data.song_time]);
		console.log("Effects updated:");
		console.dir(effectColumns);

		// generate "Types" array with dynamic keys
		var effectTypes = {};
		for(i = 0; i < data.effectsLoaded.length; i++)
		{
			effectTypes[data.effectsLoaded[i]] = "step";
		}
		effectTypes["Time"] = "spline";
		console.dir(effectTypes);

		chart.flow({
			x: "Time",
			columns: effectColumns,
			types: effectTypes,
			length: 0
		});

		$("#currentTempo").text(data.tempo);
	});

	socket.on("crowd", function(data)
	{
		console.log("Crowd data:");
		$("#currentIntensity").text(data.intensity);
		
		chart.flow({
			x: "Time",
			columns: [
				['Time', data.timestamp],
				['Intensity', data.intensity]
			],
			length: 0
		});

		$("#currentIntensityRange").text(data.intensityRange);
		console.dir(data);
	});

	socket.on("song", function(data)
	{
		console.log("Song changed: ");
		$("#currentSong").text(data.title);
		console.dir(data);
	});
});