precision mediump float;

// LUT resolution for one component (4, 8, 16, ...)
uniform float u_resolution;

layout(location = 0) out vec4 fragColor;

// texture coordinate of current fragment
in vec2 v_uv;

void main(void)
{
    // TODO: generate a NxNxN color LUT, stored as N*N by N pixel 2D image
    fragColor = vec4(v_uv.x, v_uv.y, 0.0, 1.0);

    // REMOVE BEGIN
    // 1p correct position (0.5p per r and b, g is too simple)
    // 1p correct value (div by res-1 to get true black and white)
    float rPos = fract(v_uv.x * u_resolution);
    float bPos = floor(v_uv.x * u_resolution) / u_resolution;

    vec3 pos = vec3(rPos, v_uv.y, bPos);
    vec3 color = floor(pos * u_resolution) / (u_resolution - 1.0);

    fragColor = vec4(color, 1.0);
    // REMOVE END
}
