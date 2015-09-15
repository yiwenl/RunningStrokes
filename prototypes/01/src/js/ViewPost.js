// ViewPost.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewPost() {
	bongiovi.View.call(this, null, glslify("../shaders/post.frag"));
}

var p = ViewPost.prototype = new bongiovi.View();
p.constructor = ViewPost;


p._init = function() {
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture, textureVideo, textureGradient) {
	if(!this.shader.isReady() ) return;

	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	this.shader.uniform("textureVideo", "uniform1i", 1);
	textureVideo.bind(1);
	this.shader.uniform("textureGradient", "uniform1i", 2);
	textureGradient.bind(2);
	this.shader.uniform("gradientOffset", "uniform1f", params.gradientOffset);
	GL.draw(this.mesh);
};

module.exports = ViewPost;