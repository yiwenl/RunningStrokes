precision mediump float;

uniform sampler2D texture;
uniform sampler2D textureVideo;
uniform sampler2D textureGradient;
varying vec2 vTextureCoord;
uniform float gradientOffset;

const float MAX_BRIGHTNESS = length(vec3(1.0));
const vec3 COLOR_RED = vec3(221.0/255.0, 36.0/255.0, 37.0/255.0);

void main(void) {
	vec4 color      = texture2D(texture, vTextureCoord);
	color.rgb 		*= COLOR_RED * 1.5;

	vec3 colorVideo = texture2D(textureVideo, vTextureCoord).rgb;
	colorVideo      = mix(color.rgb, colorVideo, .5);
	color.rgb       *= colorVideo;
	color.a 		*= .9;
    gl_FragColor = color;
}