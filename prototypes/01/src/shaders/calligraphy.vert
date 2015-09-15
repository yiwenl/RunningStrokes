// calligraphy.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform vec3 position;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform sampler2D texture;

varying vec2 vTextureCoord;
varying vec3 vVertexPosition;
varying float vDepth;

const float W = 660.0;
const float H = 428.0;

//float n = 5.0;
//float f = 800.0;
	
float getDepth(float z, float n, float f) {
	return (2.0 * n) / (f + n - z*(f-n));
}

float contrast(float mValue, float mScale, float mMidPoint) {
	return clamp( (mValue - mMidPoint) * mScale + mMidPoint, 0.0, 1.0);
}

float contrast(float mValue, float mScale) {
	return contrast(mValue,  mScale, .5);
}

void main(void) {
	vec3 pos = aVertexPosition + position;
	vec4 V = uPMatrix * (uMVMatrix * vec4(pos, 1.0));
    gl_Position = V;

    vDepth = contrast(1.0-getDepth(V.z/V.w, 5.0, 800.0), 4.0, .375);

    vTextureCoord = aTextureCoord;
}