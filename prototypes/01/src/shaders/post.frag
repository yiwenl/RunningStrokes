precision mediump float;

uniform sampler2D texture;
uniform sampler2D textureVideo;
varying vec2 vTextureCoord;

void main(void) {
    vec4 color = texture2D(texture, vTextureCoord);
    vec3 colorVideo = texture2D(textureVideo, vTextureCoord).rgb;
    colorVideo = mix(color.rgb, colorVideo, .5);
    color.rgb *= colorVideo * 1.25;
    // color.rgb = colorVideo;

    gl_FragColor = color;
}