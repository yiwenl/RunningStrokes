#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec4 vColor;

varying vec2 vTextureCoord;
uniform sampler2D textureInk;
uniform sampler2D textureGradient;
uniform sampler2D textureNoise;
varying vec3 vNormal;
uniform float gradientOffset;
uniform float noiseOffset;
varying float vDepth;

const vec3 DIRECTIONAL_LIGHT_COLOR 		= vec3(1.0);
const vec3 AMBIENT_LIGHT_COLOR 			= vec3(.6);
const float DIRECTIONAL_LIGHT_WEIGHT 	= 1.5;
const vec3 DIRECTIONAL_LIGHT_POS 		= vec3(.5, 0.3, 1.0);

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

vec3 contrast(vec3 mValue, float mScale, float mMidPoint) {
	return vec3( contrast(mValue.r, mScale, mMidPoint), contrast(mValue.g, mScale, mMidPoint), contrast(mValue.b, mScale, mMidPoint));
}

vec3 contrast(vec3 mValue, float mScale) {
	return contrast(mValue, mScale, .5);
}


const vec3 background_color = vec3(1.0, 1.0, 250.0/255.0);

void main(void) {
	float MAX_BRIGHTNESS = length(vec3(1.0));
	
	vec4 color         = texture2D(textureInk, vTextureCoord);
	vec2 uvNoise       = vTextureCoord * 5.0;
	float grey         = (color.r + color.g + color.b) / 3.0;
	grey += .3;
	if(grey > 1.0) grey = 1.0;
	// color.rgb          = mix(color.rgb, vec3(grey), .35);
	color.rgb          = contrast(vec3(grey), 2.0);
	// color.rgb          *= 1.5;
	vec3 ambient       = AMBIENT_LIGHT_COLOR;
	vec3 bump 		   = texture2D(textureNoise, uvNoise).rgb - vec3(.5);
	vec3 normal        = normalize(vNormal + bump * noiseOffset);
	float lamberFactor = max(0.0, dot(normal, normalize(DIRECTIONAL_LIGHT_POS)));
	vec3 directional   = DIRECTIONAL_LIGHT_COLOR * lamberFactor * DIRECTIONAL_LIGHT_WEIGHT;
	
	color.rgb          = color.rgb * (ambient + directional);
	// color.rgb          = ambient + color.rgb * ( directional);

	float p         = length(color.rgb) / MAX_BRIGHTNESS;
	vec2 uvMap      = vec2(p, .5);
	
	color.rgb       = mix(color.rgb, texture2D(textureGradient, uvMap).rgb, gradientOffset);
	// color.rgb		= mix(background_color, color.rgb - vec3((1.0-vDepth)*.95), vDepth);
	color.rgb		= mix(background_color, color.rgb - vec3(vDepth*.05), vDepth);
	// color.a 		*= vDepth;

	gl_FragColor = color;
}