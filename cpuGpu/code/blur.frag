precision lowp float;

// uniform input values are shared between fragments
// input image
uniform sampler2D u_texture;
// resolution of input image
uniform vec2 u_resolution;
// radius for blur kernel
uniform float u_radius;

layout(location = 0) out vec4 fragColor;

// varying input values are set by the vertex shader
// texture coordinate of current fragment
in vec2 v_uv;

void main(void)
{
    // TODO - implement blur
    vec3 nuColor = vec3(0.0, 0.0, 0.0);
    float weight_factor = (2.0*u_radius+1.0) * (2.0*u_radius+1.0);
    vec2 blurUnit = vec2(1.0, 1.0) / u_resolution;
    for(float v_it = -u_radius; v_it <= u_radius; v_it++){
        for(float u_it = -u_radius; u_it <= u_radius; u_it++){
            nuColor += vec3(texture(u_texture, v_uv+vec2(u_it*blurUnit.x, v_it*blurUnit.y)))/weight_factor;
        }
    }
    fragColor = vec4(nuColor, 1.0);
    //fragColor = texture(u_texture, v_uv+vec2(0.0, 0.0));

}
