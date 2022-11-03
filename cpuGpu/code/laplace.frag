precision lowp float;

// uniform input values are shared between fragments
// input image
uniform sampler2D u_texture;
// resolution of input image
uniform vec2 u_resolution;

layout(location = 0) out vec4 fragColor;

// varying input values are set by the vertex shader
// texture coordinate of current fragment
in vec2 v_uv;

// TODO: set correct kernel
// kernel for weighting the neighboring pixels
const mat3 kernel = mat3(
    -1, -2, -1, // first column
    -2, 12, -2, // second column
    -1, -2, -1 // third column
);



void main(void)
{
    // TODO - implement laplace
    vec3 nuColor = vec3(0.0, 0.0, 0.0);
    vec2 img_unit = vec2(1.0, 1.0) / u_resolution;
    for(float v_it = -1.0; v_it <= 1.0; v_it++){
        for(float u_it = -1.0; u_it <= 1.0; u_it++){
            vec2 uv_it = vec2(u_it*img_unit.x, v_it*img_unit.y);
            nuColor += vec3(texture(u_texture, v_uv+uv_it))*kernel[int(v_it+1.0)][int(u_it+1.0)];
        }
    }
    fragColor = vec4(nuColor, 1.0);

}
