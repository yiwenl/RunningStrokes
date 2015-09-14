// ViewCalligraphy.js

var GL = bongiovi.GL;
var gl;
var W = 660;
var H = 428;

function map(value, sx, sy, tx, ty) {
	var p = (value - sx) / (sy - sx);
	return tx + (ty - tx) * p;
};


function ViewCalligraphy(points) {
	// console.log(points);
	this._points = points;
	bongiovi.View.call(this, null, bongiovi.ShaderLibs.get("simpleColorFrag"));
}

var p = ViewCalligraphy.prototype = new bongiovi.View();
p.constructor = ViewCalligraphy;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 
	var index = 0;


	function getPoint(p) {
		var v = [0, 0, 0];
		v[0] = map(p.lng, MapModel.TL.lng, MapModel.BR.lng, -W/2, W/2);
		v[2] = map(p.lat, MapModel.TL.lat, MapModel.BR.lat, -H/2, H/2);
		v[1] = p.elevation + 20;

		return v;
	}

	for(var i=0; i<this._points.length-1; i++) {
		var p0 = getPoint(this._points[i]);
		var p1 = getPoint(this._points[i+1]);

		console.log(p0);

		positions.push(p0);
		positions.push(p1);

		coords.push([0, 0]);
		coords.push([0, 0]);

		indices.push(index);
		indices.push(index+1);

		index += 2;
	}

	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.LINES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};

p.render = function(texture) {
	if(!this.shader.isReady() ) return;

	this.shader.bind();
	if(texture) {
		this.shader.uniform("texture", "uniform1i", 0);
		texture.bind(0);	
	}
	this.shader.uniform("color", "uniform3fv", [1, 0, 0]);
	this.shader.uniform("opacity", "uniform1f", 1);
	GL.draw(this.mesh);
};

module.exports = ViewCalligraphy;