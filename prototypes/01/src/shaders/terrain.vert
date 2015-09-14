#define SHADER_NAME BASIC_VERTEX

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform sampler2D texture;

varying vec2 vTextureCoord;
varying vec4 vColor;
varying vec3 vNormal;
varying vec3 vVertexPosition;


const float W = 660.0;
const float H = 428.0;


float map(float value, float sx, float sy, float tx, float ty) {
	float p = (value - sx) / ( sy - sx);
	return tx + p * ( ty - tx);
}

float contrast(float mValue, float mScale, float mMidPoint) {
	return clamp( (mValue - mMidPoint) * mScale + mMidPoint, 0.0, 1.0);
}

float contrast(float mValue, float mScale) {
	return contrast(mValue,  mScale, .5);
}

vec2 contrast(vec2 mValue, float mScale, float mMidPoint) {
	return vec2( contrast(mValue.r, mScale, mMidPoint), contrast(mValue.g, mScale, mMidPoint));
}

vec2 contrast(vec2 mValue, float mScale) {
	return contrast(mValue, mScale, .5);
}

vec3 getPos(vec2 uv) {
	vec2 newUv = contrast(uv, .995);
	float h = texture2D(texture, newUv).r;
	vec3 v;

	v.x = -W*.5 + W * newUv.x;
	v.z = H*.5 - H * newUv.y;

	v.y = h * 300.0 - 50.0;
	return v;
}


const float gap = .01;

void main(void) {
	vec4 colorHeight = texture2D(texture, aTextureCoord);
	vec3 pos = aVertexPosition;
	pos = getPos(aTextureCoord);
	
	vec3 posRight = getPos(aTextureCoord+vec2(gap, 0.0));
	vec3 posBottom = getPos(aTextureCoord+vec2(0.0, gap));

	vec3 vRight = posRight - pos;
	vec3 vBottom = posBottom - pos;

    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;

    vColor = colorHeight;
    vNormal = normalize(cross(vRight, vBottom));
    vVertexPosition = pos;
}