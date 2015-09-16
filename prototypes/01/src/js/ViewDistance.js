// ViewDistance.js

var GL = bongiovi.GL;
var gl;

function ViewDistance() {
	bongiovi.View.call(this);
}

var p = ViewDistance.prototype = new bongiovi.View();
p.constructor = ViewDistance;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7]; 

	var tz = 250;
	var size = 50;
	positions.push([-size, 0, tz+size/2])
	positions.push([ size, 0, tz+size/2])
	positions.push([ size, 0, tz-size/2])
	positions.push([-size, 0, tz-size/2])

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	positions.push([-size, 0, -tz+size/2])
	positions.push([ size, 0, -tz+size/2])
	positions.push([ size, 0, -tz-size/2])
	positions.push([-size, 0, -tz-size/2])

	coords.push([1, 1]);
	coords.push([0, 1]);
	coords.push([0, 0]);
	coords.push([1, 0]);

	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};

p.render = function(texture) {
	if(!this.shader.isReady() ) return;

	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewDistance;