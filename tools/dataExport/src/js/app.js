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

		var trackpoints = [];

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

			var o = {
				lat:lat,
				lng:lng,
				elevation:elevation
			}

			trackpoints.push(o);
		}


		this.tracks.push(trackpoints);
		console.log(this.tracks.length);
		this.loadNextRecord();
	};

})();


new App();