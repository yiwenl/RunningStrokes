// app.js
window.bongiovi = require("./libs/bongiovi.js");
var dat = require("dat-gui");


var saveJson = function(obj) {
	var str = JSON.stringify(obj);
	var data = encode( str );

	var blob = new Blob( [ data ], {
		type: 'application/octet-stream'
	});
	
	url = URL.createObjectURL( blob );
	var link = document.createElement( 'a' );
	link.setAttribute( 'href', url );
	link.setAttribute( 'download', 'data.json' );
	var event = document.createEvent( 'MouseEvents' );
	event.initMouseEvent( 'click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
	link.dispatchEvent( event );
};


var encode = function( s ) {
	var out = [];
	for ( var i = 0; i < s.length; i++ ) {
		out[i] = s.charCodeAt(i);
	}
	return new Uint8Array( out );
};

(function() {
	var SceneApp = require("./SceneApp");

	App = function() {
		if(document.body) this._init();
		else {
			window.addEventListener("load", this._init.bind(this));
		}
	}

	var p = App.prototype;

	p._init = function() {
		this.canvas = document.createElement("canvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.canvas.className = "Main-Canvas";
		document.body.appendChild(this.canvas);
		bongiovi.GL.init(this.canvas);

		this._scene = new SceneApp();
		bongiovi.Scheduler.addEF(this, this._loop);

		// this.gui = new dat.GUI({width:300});

		this.tracks = [];

		this.paths = [
			"activities/20150531-100911-Run.gpx",
			"activities/20150603-181803-Run.gpx",
			"activities/20150607-153058-Run.gpx",
			"activities/20150610-181919-Run.gpx",
			"activities/20150614-102704-Run.gpx",
			"activities/20150618-181756-Run.gpx",
			"activities/20150621-160157-Run.gpx",
			"activities/20150705-105513-Run.gpx",
			"activities/20150727-181521-Run.gpx",
			"activities/20150801-185150-Run.gpx",
			"activities/20150802-174908-Run.gpx",
			"activities/20150805-181253-Run.gpx",
			"activities/20150815-171535-Run.gpx",
			"activities/20150905-164832-Run.gpx"
		]

		// this.loadRecord(paths[0], this._onRecord.bind(this));
		this.loadNextRecord();
	};

	p._loop = function() {
		this._scene.loop();
	};


	p.loadNextRecord = function() {
		if(this.paths.length == 0) {
			console.log('All loaded');
			saveJson(this.tracks);
			return;
		}
		var url = this.paths.pop();
		this.loadRecord(url, this._onRecord.bind(this));
	};


	p.loadRecord = function(url, callback) {
		var xmlHttp = new XMLHttpRequest();
	    xmlHttp.onreadystatechange = function() { 
	        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
	            callback(xmlHttp.responseText, url);
	    }
	    xmlHttp.open("GET", url, true); // true for asynchronous 
	    xmlHttp.send(null);
	};

	p._onRecord = function(text, url) {
		console.log('URL : ', url);
		var reg = /<trkpt.*\n.*\n.*\n.*<\/trkpt>/g;
		var results = text.match(reg);

		var regLat = /.*lat\=\"\-*\d*\.\d*\"/i;
		var regLng = /.*lon\=\"\-*\d*\.\d*/i;
		var reqEle = /\d*\.\d*/i;
		var reqDate = /\d+\-\d+\-\d+/i;
		var reqTime = /\d+\:\d+\:\d+/g;

		var trackpoints = [];
		var elevationGain = 0;
		var lastElevation;
		var dateStr = "";
		var startTime, endTime;

		// console.log(results.length, results);
		for(var i=0; i<results.length; i++) {
			var lines = results[i].split("\n");
			
			var latStr = lines[0].match(regLat)[0].split("lat=")[1].replace(/\"/g, "");
			var lat = parseFloat(latStr);
			var lngStr = lines[0].match(regLng)[0].split("lon=")[1].replace(/\"/g, "");;
			var lng = parseFloat(lngStr);
			// console.log(lat, lng);

			var eleStr = lines[1].match(reqEle);
			var elevation = parseFloat(eleStr);

			if(!dateStr) {
				dateStr = lines[2].match(reqDate)[0];
				console.log(dateStr);	
			}


			if(i==0) {
				var timeStr = lines[2].match(reqTime)[0];	
				startTime = timeStr
			} else if(i == results.length-1) {
				var timeStr = lines[2].match(reqTime)[0];	
				endTime = timeStr
			}

			

			if(lastElevation !== undefined) {
				if(elevation > lastElevation) {
					elevationGain += (elevation - lastElevation);
				}
			}

			lastElevation = elevation;

			var o = {
				lat:lat,
				lng:lng,
				elevation:elevation
			}

			trackpoints.push(o);
		}


		function radians(value) {	return value * Math.PI / 180;	};

		function getDistance(p0, p1) {
			var R = 6371000; // metres
			var φ1 = radians(p0.lat);
			var φ2 = radians(p1.lat);

			var Δφ = radians(p1.lat-p0.lat);
			var Δλ = radians(p1.lng-p0.lng);

			var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
			        Math.cos(φ1) * Math.cos(φ2) *
			        Math.sin(Δλ/2) * Math.sin(Δλ/2);

			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
			return R * c;
		}

		var totalDistance = 0;
		
		for(var i=0; i<trackpoints.length-1; i++) {
			var p0 = trackpoints[i];
			var p1 = trackpoints[i+1];
			var d = getDistance(p0, p1);
			totalDistance += d;
		}


		function getDuration(s, e) {
			var t0 = s.split(":");
			var t1 = e.split(":");

			var hDiff = parseInt(t1[0]) - parseInt(t0[0]);
			var mDiff = parseInt(t1[1]) - parseInt(t0[1]);
			var sDiff = parseInt(t1[2]) - parseInt(t0[2]);

			if(sDiff < 0) {
				mDiff -= 1;
				sDiff += 60;
			}

			if(mDiff < 0) {
				hDiff -= 1;
				mDiff += 60;
			}

			return  {
				h:hDiff,
				m:mDiff,
				s:sDiff
			}
		}

		function getSpeed(distance, duration) {
			var time = duration.m + duration.s / 60;
			return distance / time;
		}

		var duration = getDuration(startTime, endTime);
		// var speed = getSpeed(totalDistance*0.000621371, duration);
		// console.log('Speed : ', speed);

		var prec = 100;
		var trackData = {
			trackpoints:trackpoints,
			totalDistance:Math.floor(totalDistance*0.000621371*prec) / prec,
			elevationGain:Math.floor(elevationGain*3.28084*prec) / prec,
			duration:duration,
			date:dateStr
		}

		console.log(trackData);

		this.tracks.push(trackData);
		this.loadNextRecord();
	};

})();


new App();