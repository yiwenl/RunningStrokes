var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewBlur(isVertical) {
	if(isVertical) {
		bongiovi.View.call(this, glslify("../shaders/VBlur.vert"), glslify("../shaders/blur.frag"));
	} else {
		bongiovi.View.call(this, glslify("../shaders/HBlur.vert"), glslify("../shaders/blur.frag"));
	}
}

var p = ViewBlur.prototype = new bongiovi.View();
p.constructor = ViewBlur;


p._init = function() {
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture) {
	if(!this.shader.isReady() ) return;

	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("selfOffset", "uniform1f", 1.0);
	this.shader.uniform("blur", "uniform1f", .15);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewBlur;
