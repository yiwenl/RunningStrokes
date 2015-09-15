// calligraphy.frag

precision mediump float;

uniform sampler2D texture;
varying vec2 vTextureCoord;
uniform float opacity;
uniform float progress;
varying float vDepth;

const vec3 background_color = vec3(1.0, 1.0, 250.0/255.0);
const float range = .1;
const float PI = 3.141592657;

void main(void) {
    vec4 color = texture2D(texture, vTextureCoord);
    if(color.a < .05) discard;

    float offset = 0.0;
    if(vTextureCoord.x < progress) offset = 1.0;
    else if(vTextureCoord.x < progress + range) {
    	offset = cos((vTextureCoord.x - progress) / range * PI * .5);
    }

    // color.rgb		= mix(background_color, color.rgb, mix(vDepth, 1.0,);

    gl_FragColor = color * opacity * offset;
}