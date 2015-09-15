// calligraphy.frag

precision mediump float;

uniform sampler2D texture;
varying vec2 vTextureCoord;

void main(void) {
    vec4 color = texture2D(texture, vTextureCoord);
    if(color.a < .05) discard;

    gl_FragColor = color;
}