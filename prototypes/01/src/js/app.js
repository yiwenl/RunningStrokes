// app.js
window.bongiovi = require("./libs/bongiovi.js");
var dat = require("dat-gui");

(function() {
	var SceneApp = require("./SceneApp");

	App = function() {

		var toLoad = [
			"assets/heightMap.png"
			]

		for(var i=0; i<=33; i++) {
			var str = "assets/inkDrops/inkDrops"+i.toString()+".jpg"
			toLoad.push(str);
		}

		var loader = new bongiovi.SimpleImageLoader();
		loader.load(toLoad, this, this._onImageLoaded)

		
	}

	var p = App.prototype;

	p._onImageLoaded = function(img) {
		window.images = img;
		console.log(window.images);
		if(document.body) this._init();
		else {
			window.addEventListener("load", this._init.bind(this));
		}
	};

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

		// this.findRegion();
	};

	p._loop = function() {
		this._scene.loop();
	};



	p.findRegion = function() {
		var minLat, maxLat, minLng, maxLng;
		for(var i=0; i<tracks.length; i++) {
			var track = tracks[i];
			for(var j=0; j<track.length; j++) {
				var point = track[j];

				if(minLat === undefined) {
					minLat = point.lat;
					maxLat = point.lat;
					minLng = point.lng;
					maxLng = point.lng;
				} else {
					minLat = Math.min(minLat, point.lat);
					maxLat = Math.max(maxLat, point.lat);
					minLng = Math.min(minLng, point.lng);
					maxLng = Math.max(maxLng, point.lng);
				}

			}
		}


		console.log("Lat : ", minLat, maxLat, ", Lng:", minLng, maxLng);
		console.log("Lat : ", (minLat + maxLat)/2, ", Lng:", (minLng + maxLng)/2);
	};

})();


new App();