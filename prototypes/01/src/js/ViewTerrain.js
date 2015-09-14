// ViewTerrain.js
var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewTerrain() {
	bongiovi.View.call(this, glslify("../shaders/terrain.vert"), glslify("../shaders/terrain.frag"));
}

var p = ViewTerrain.prototype = new bongiovi.View();
p.constructor = ViewTerrain;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 
	var index = 0;
	var num = 40;
	var W = 660;
	var H = 428;
	var scale = 1.0;
	var uvGap = 1/num;

	function getPos(i, j) {
		var x = -W/2 + i/num*W;
		var z = H/2 - j/num*H;
		return [x*scale, 0, z*scale];
	}

	for(var j=0; j<num;j++) {
		for(var i=0; i<num;i++) {
			positions.push(getPos(i, j));
			positions.push(getPos(i+1, j));
			positions.push(getPos(i+1, j+1));
			positions.push(getPos(i, j+1));

			coords.push([i/num, j/num]);
			coords.push([i/num+uvGap, j/num]);
			coords.push([i/num+uvGap, j/num+uvGap]);
			coords.push([i/num, j/num+uvGap]);

			indices.push(index*4 + 0);
			indices.push(index*4 + 1);
			indices.push(index*4 + 2);
			indices.push(index*4 + 0);
			indices.push(index*4 + 2);
			indices.push(index*4 + 3);

			index++;
		}
	}

	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};

p.render = function(texture, textureInk) {
	if(!this.shader.isReady() ) return;

	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("textureInk", "uniform1i", 1);
	texture.bind(0);	
	textureInk.bind(1);	
	this.shader.uniform("color", "uniform3fv", [1, 1, 1]);
	this.shader.uniform("opacity", "uniform1f", 1);
	GL.draw(this.mesh);
};

module.exports = ViewTerrain;