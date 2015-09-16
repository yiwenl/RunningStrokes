// calligraphy.frag

precision mediump float;

uniform sampler2D texture;
uniform sampler2D textureNormal;
varying vec2 vTextureCoord;
uniform float opacity;
uniform float progress;
varying float vDepth;
varying vec3 vNormal;


const vec3 background_color = vec3(1.0, 1.0, 250.0/255.0);
const float range = .1;
const float PI = 3.141592657;

const vec3 DIRECTIONAL_LIGHT_COLOR 		= vec3(1.0);
const vec3 AMBIENT_LIGHT_COLOR 			= vec3(.1);
const float DIRECTIONAL_LIGHT_WEIGHT 	= 2.0;
const vec3 DIRECTIONAL_LIGHT_POS 		= vec3(.5, 0.3, 1.0);

void main(void) {
    vec4 color = texture2D(texture, vTextureCoord);
    if(color.a < .05) discard;

    float offset = 0.0;
    if(vTextureCoord.x < progress) offset = 1.0;
    else if(vTextureCoord.x < progress + range) {
    	offset = cos((vTextureCoord.x - progress) / range * PI * .5);
    }

    vec2 uvNormal 	   = vTextureCoord*25.0;
    uvNormal.y 		   *= .05;
    vec3 bump 		   = (texture2D(textureNormal, uvNormal).rgb-.5) * 2.0;
    vec3 normal        = normalize(vNormal + bump * .5);
	vec3 ambient       = AMBIENT_LIGHT_COLOR;
	float lamberFactor = max(0.0, dot(normal, normalize(DIRECTIONAL_LIGHT_POS)));
	vec3 directional   = DIRECTIONAL_LIGHT_COLOR * lamberFactor * DIRECTIONAL_LIGHT_WEIGHT;

	color.rgb          = color.rgb * (ambient + directional);

    gl_FragColor = color * opacity * offset;


    //	debug normal
    // gl_FragColor.rgb = (vNormal + 1.0) * .5;
}