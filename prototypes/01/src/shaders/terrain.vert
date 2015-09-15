#define SHADER_NAME VERTEX_TERRAIN

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform sampler2D texture;
uniform sampler2D textureDetail;

varying vec2 vTextureCoord;
varying vec4 vColor;
varying vec3 vNormal;
varying vec3 vVertexPosition;


const float W = 660.0;
const float H = 428.0;

//float n = 5.0;
//float f = 800.0;
	
float getDepth(float z, float n, float f) {
	return (2.0 * n) / (f + n - z*(f-n));
}


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
	vec2 uvDetail = newUv * 3.0;
	float h = texture2D(texture, newUv).r;
	float hDetail = texture2D(textureDetail, uvDetail).r * .005;
	h += hDetail;
	vec3 v;

	v.x = -W*.5 + W * newUv.x;
	v.z = H*.5 - H * newUv.y;

	v.y = h * 300.0 - 50.0;
	return v;
}


const float gap = .01;
varying float vDepth;


void main(void) {
	vec4 colorHeight = texture2D(texture, aTextureCoord);
	vec3 pos = aVertexPosition;
	pos = getPos(aTextureCoord);

	vec2 uvRight = aTextureCoord+vec2(gap, 0.0);
	vec2 uvBottom = aTextureCoord+vec2(0.0, gap);
	
	vec3 posRight = getPos(uvRight);
	vec3 posBottom = getPos(uvBottom);

	vec3 vRight = posRight - pos;
	vec3 vBottom = posBottom - pos;

	vec4 V = uPMatrix * (uMVMatrix * vec4(pos, 1.0));
    gl_Position = V;

    // vDepth = mix(contrast(1.0-getDepth(V.z/V.w, 5.0, 760.0), 3.0, .375), 1.0, .95);
    vDepth = contrast(1.0-getDepth(V.z/V.w, 5.0, 760.0), 3.5, .325);

    vTextureCoord = aTextureCoord;

    vColor = colorHeight;
    vNormal = normalize(cross(vRight, vBottom));
    if(uvRight.x >= 1.0 || uvBottom.y >= 1.0) {
    	vNormal = vec3(0.0, 1.0, 0.0);
    }
    vVertexPosition = pos;
}