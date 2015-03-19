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

	socket.on("update", function(data)
	{
		console.log("Update packet received:");
		console.dir(data);

		var flowColumns = [];

		if(Object.keys(data.ableton).length != 0)
		{

			console.log("Ableton data:");
			console.dir(data.ableton);
			var ableton = data.ableton;
			$("#currentEffects").text(ableton.effectsOn);

			// load effects
			var effectColumns = [];
			for(i = 0; i < ableton.effectsLoaded.length; i++)
			{
				if(ableton.effectsOn.indexOf(ableton.effectsLoaded[i]) == -1)
				{
					// effect channel not turned on
					//effectColumns.push([ableton.effectsLoaded[i], 0]);
					flowColumns.push([ableton.effectsLoaded[i], 0]);
				}
				else
				{
					// channel is turned on
					//effectColumns.push([ableton.effectsLoaded[i], 1]);
					flowColumns.push([ableton.effectsLoaded[i], 1]);
				}
			}

			//effectColumns.push(["Time", ableton.song_time]);
			console.log("Effects updated:");
			console.dir(effectColumns);

			// generate "Types" array with dynamic keys
			var effectTypes = {};
			for(i = 0; i < ableton.effectsLoaded.length; i++)
			{
				effectTypes[ableton.effectsLoaded[i]] = "step";
			}
			effectTypes["Time"] = "spline";
			console.dir(effectTypes);

			// chart.flow({
			// 	x: "Time",
			// 	columns: effectColumns,
			// 	types: effectTypes,
			// 	length: 0
			// });
			
			$("#currentTempo").text(ableton.tempo);
		}

		if(Object.keys(data.crowd).length != 0)
		{
			console.log("Crowd data:");
			console.dir(data.crowd);
			var crowd = data.crowd;
			$("#currentIntensity").text(crowd.intensity);
			
			// chart.flow({
			// 	x: "Time",
			// 	columns: [
			// 		['Time', crowd.timestamp],
			// 		['Intensity', crowd.intensity]
			// 	],
			// 	length: 0
			// });

			flowColumns.push(["Intensity", crowd.intensity]);

			$("#currentIntensityRange").text(crowd.intensityRange);
			console.dir(crowd);
		}


		if(Object.keys(data.song).length != 0)
		{
			console.log("Song changed: ");
			$("#currentSong").text(data.song.title);
			console.dir(data.song);
		}

		// only update the graph if either ableton or crowd data changed
		if(Object.keys(data.ableton).length != 0 || Object.keys(data.crowd).length != 0)
		{
			flowColumns.push(["Time", data.song_time]);
			chart.flow({
				x: "Time",
				columns: flowColumns,
				length: 0
			});
		}
	});
});