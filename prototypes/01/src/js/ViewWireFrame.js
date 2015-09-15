// ViewWireFrame.js

var GL = bongiovi.GL;
var gl;

function ViewWireFrame(positions, coords, indices) {
	this.positions = positions;
	this.coords = coords;
	this.indices = indices;
	bongiovi.View.call(this, bongiovi.ShaderLibs.get("generalVert"), bongiovi.ShaderLibs.get("simpleColorFrag"));
}

var p = ViewWireFrame.prototype = new bongiovi.View();
p.constructor = ViewWireFrame;


p._init = function() {
	gl = GL.gl;
	this.mesh = new bongiovi.Mesh(this.positions.length, this.indices.length, GL.gl.LINES);
	this.mesh.bufferVertex(this.positions);
	this.mesh.bufferTexCoords(this.coords);
	this.mesh.bufferIndices(this.indices);
};

p.render = function() {
	if(!this.shader.isReady() ) return;

	this.shader.bind();
	this.shader.uniform("position", "uniform3fv", [0, -2, 0]);
	this.shader.uniform("scale", "uniform3fv", [1, 1, 1]);
	this.shader.uniform("color", "uniform3fv", [0, 0, 0]);
	this.shader.uniform("opacity", "uniform1f", .65);
	GL.draw(this.mesh);
};

module.exports = ViewWireFrame;