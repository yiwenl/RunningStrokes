#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec4 vColor;

varying vec2 vTextureCoord;
uniform sampler2D textureInk;
varying vec3 vNormal;


const vec3 DIRECTIONAL_LIGHT_COLOR 		= vec3(1.0);
const vec3 AMBIENT_LIGHT_COLOR 			= vec3(.4);
const float DIRECTIONAL_LIGHT_WEIGHT 	= 1.0;
const vec3 DIRECTIONAL_LIGHT_POS 		= vec3(.5, 0.3, 1.0);

float map(float value, float sx, float sy, float tx, float ty) {
	float p = (value - sx) / ( sy - sx);
	return tx + p * ( ty - tx);
}

void main(void) {
	vec4 color = texture2D(textureInk, vTextureCoord);
	color.rgb *= 1.25;
	// color.rgb = vec3(1.0, 1.0, .92);
	vec3 ambient = AMBIENT_LIGHT_COLOR;
	float lamberFactor = max(0.0, dot(vNormal, normalize(DIRECTIONAL_LIGHT_POS)));
	vec3 directional = DIRECTIONAL_LIGHT_COLOR * lamberFactor * DIRECTIONAL_LIGHT_WEIGHT;

	// color.rgb = ambient + color.rgb * directional;
	color.rgb = color.rgb * (ambient + directional);
	gl_FragColor = color;
}