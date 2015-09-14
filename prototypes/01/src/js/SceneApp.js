// SceneApp.js

var GL = bongiovi.GL, gl;
var ViewTerrain = require("./ViewTerrain");

function SceneApp() {
	gl = GL.gl;
	bongiovi.Scene.call(this);

	this.sceneRotation.lock(true);
	this.camera.lockRotation(false);

	window.addEventListener("resize", this.resize.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');
	this._textureHeight = new bongiovi.GLTexture(images.heightMap);
	var index = Math.floor(Math.random() * 33);
	this._textureInk = new bongiovi.GLTexture(images["inkDrops" + index]);
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();
	this._vTerrain = new ViewTerrain();
};

p.render = function() {
	GL.clear(1, 1, .986, 1);
	// this._vAxis.render();
	this._vDotPlane.render();

	this._vTerrain.render(this._textureHeight, this._textureInk);
};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;