$(function()
{
	var socket = io('http://localhost:3000');

	var intensity = c3.generate({
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

	var effects = c3.generate({
		bindto: "#effectsGraph",
		data: {
			x: "time",
			columns: [
				['time']
			]
		},
		axis: {
			x: {
				type: "timeseries"
			}
		}
	});

/*
var chart = c3.generate({
	bindto: "#intensityGraph",
  data: {
  	columns: []
  },
  axis: {
    x: {
      type: 'category'
    }
  }
});
*/

	socket.on("update", function(data)
	{
		console.log("Update packet received:");
		console.dir(data);

		var flowColumns = [];
		var flowJSON = {};

		var valueKeys = [];


		var abletonJSON = {}

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
					flowJSON[ableton.effectsLoaded[i]] = 0;
					abletonJSON[ableton.effectsLoaded[i]] = 0;
				}
				else
				{
					// channel is turned on
					//effectColumns.push([ableton.effectsLoaded[i], 1]);
					flowColumns.push([ableton.effectsLoaded[i], 1]);
					flowJSON[ableton.effectsLoaded[i]] = 1;
					abletonJSON[ableton.effectsLoaded[i]] = 1;
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
			//console.dir(effectTypes);

			// chart.flow({
			// 	x: "Time",
			// 	columns: effectColumns,
			// 	types: effectTypes,
			// 	length: 0
			// });
			
			valueKeys = data.ableton.effectsLoaded;

			$("#currentTempo").text(ableton.tempo);

			abletonJSON.time = data.song_time;

			effects.flow({
				json: [abletonJSON],
				keys: {
					x: "time",
					value: valueKeys
				},
				length: 0,
				types: effectTypes
			});
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

			//flowColumns.push(["Intensity", crowd.intensity]);
			//flowJSON.Intensity = crowd.intensity;

			console.log("data song time" + data.song_time);
			console.log("data crowd intensity" + data.crowd.intensity);

			intensity.flow({
				x: "Time",
				columns: [
					['Time', data.song_time],
					['Intensity', data.crowd.intensity]
				],
				length: 0
			});


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
			/*
			flowColumns.push(["Time", data.song_time]);
			console.log("Flowing columns:");
			console.dir(flowColumns);
			chart.flow({
				x: "Time",
				columns: flowColumns,
				length: 0
			});
			*/

			flowJSON.time = data.song_time;
			console.log("Flowing JSON:");
			console.dir(flowJSON);

			valueKeys.push("Intensity");

			console.log("Value keys:");
			//valueKeys.push("time");
			console.dir(valueKeys);


// TRY FLOWING INTENSITY VALUES SEPARATELY FROM FILTER DATA
/*
			chart.flow({
					json: [flowJSON],
					keys: {
						x: "time",
						value: valueKeys
					},
					length: 0,
					types: effectTypes
			});
*/
/*
			chart.flow({
			        json: [
      {a: 1, name: 'www.site1.com', upload: 200, download: 200, total: 400},
      {b: 2, name: 'www.site2.com', upload: 100, download: 300, total: 400},
      {c: 3, name: 'www.site3.com', upload: 300, download: 200, total: 500},
      {d: 4, name: 'www.site4.com', upload: 400, download: 100, total: 500},
    ],
    keys: {
      x: 'a', // it's possible to specify 'x' when category axis
      value: ['upload', 'download'],
    }
			})
*/
		}
	});

});