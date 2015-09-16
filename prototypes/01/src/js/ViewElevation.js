// ViewElevation.js

var GL = bongiovi.GL;
var gl;

function ViewElevation() {
	bongiovi.View.call(this);
}

var p = ViewElevation.prototype = new bongiovi.View();
p.constructor = ViewElevation;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7]; 

	var tx = 300.0;
	var ty = 110.0;
	var size = 50;
	var yscale = 1;
	positions.push([tx,  ty, -size])
	positions.push([tx,  ty,  size])
	positions.push([tx, size*yscale+ty,  size])
	positions.push([tx, size*yscale+ty, -size])

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	positions.push([-tx,  ty,  size])
	positions.push([-tx,  ty, -size])
	positions.push([-tx, size*yscale+ty, -size])
	positions.push([-tx, size*yscale+ty,  size])

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

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

module.exports = ViewElevation;