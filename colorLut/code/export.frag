precision mediump float;

// LUT resolution for one component (4, 8, 16, ...)
uniform float u_resolution;

layout(location = 0) out vec4 fragColor;

// texture coordinate of current fragment
in vec2 v_uv;

void main(void)
{
    // TODO: generate a NxNxN color LUT, stored as N*N by N pixel 2D image
    vec3 color = vec3(v_uv, 0.0);
    color.x = fract(color.x*u_resolution);
    color.x = floor(color.x * u_resolution)/(u_resolution-1.0);
    color.y = floor(color.y * u_resolution)/(u_resolution-1.0);
    color.z = floor(v_uv.x * u_resolution)/(u_resolution-1.0);
    fragColor = vec4(color, 1.0);

}
