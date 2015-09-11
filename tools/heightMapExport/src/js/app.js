// app.js


/*
Lat :  51.444926 51.445085 , Lng: -0.045359 -0.044794
*/




window.bongiovi = require("./libs/bongiovi.js");
var dat = require("dat-gui");

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
		if(!window.map) {
			bongiovi.Scheduler.next(this, this._init);
			return;
		}
		// this.canvas = document.createElement("canvas");
		// this.canvas.width = window.innerWidth;
		// this.canvas.height = window.innerHeight;
		// this.canvas.className = "Main-Canvas";
		// document.body.appendChild(this.canvas);
		// bongiovi.GL.init(this.canvas);

		// this._scene = new SceneApp();
		// bongiovi.Scheduler.addEF(this, this._loop);

		// this.gui = new dat.GUI({width:300});

		this.elevator = new google.maps.ElevationService();

		var TL = new google.maps.LatLng(MapModel.TL.lat, MapModel.TL.lng);
		var TR = new google.maps.LatLng(MapModel.TL.lat, MapModel.BR.lng);
		var BL = new google.maps.LatLng(MapModel.BR.lat, MapModel.TL.lng);
		var BR = new google.maps.LatLng(MapModel.BR.lat, MapModel.BR.lng);
		this.TL = TL; this.TR = TR; this.BL = BL; this.BR = BR;

		new google.maps.Marker({position:TL,map:map});
		new google.maps.Marker({position:BL,map:map});
		new google.maps.Marker({position:BR,map:map});
		new google.maps.Marker({position:TR,map:map});
	};

	p._loop = function() {
		this._scene.loop();
	};

})();


new App();