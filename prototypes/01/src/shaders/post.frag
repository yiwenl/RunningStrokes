precision mediump float;

uniform sampler2D texture;
uniform sampler2D textureVideo;
uniform sampler2D textureGradient;
varying vec2 vTextureCoord;
uniform float gradientOffset;

const float MAX_BRIGHTNESS = length(vec3(1.0));

void main(void) {
	vec4 color      = texture2D(texture, vTextureCoord);
	vec3 colorVideo = texture2D(textureVideo, vTextureCoord).rgb;
	colorVideo      = mix(color.rgb, colorVideo, .5);
	color.rgb       *= colorVideo * 1.25;
	
	float p         = length(color.rgb) / MAX_BRIGHTNESS;
	vec2 uvMap      = vec2(p, .5);
	
	color.rgb       = mix(color.rgb, texture2D(textureGradient, uvMap).rgb, gradientOffset);
    gl_FragColor = color;
}