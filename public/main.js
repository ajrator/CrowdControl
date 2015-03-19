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
				Intensity: 'area'
			}
		},
		axis: {
			x: {
				type: "timeseries"
			}
		}
	});

	socket.on("ableton", function(data)
	{
		console.log("Ableton data:");
		$("#currentEffects").text(data.effects);
		console.dir(data);
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