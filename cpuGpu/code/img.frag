precision mediump float;

layout(location = 0) out vec4 fragColor;

in vec2 v_uv;

uniform sampler2D u_texture;

void main(void)
{
    fragColor = vec4(texture(u_texture, v_uv).rgb, 1.0);
}
