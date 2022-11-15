precision lowp float;

layout(location = 0) out vec4 fragColor;

// position in texture [0.0, 1.0]^2
in vec2 v_uv;

// resolution of the canvas in pixels
uniform vec2 u_resolution;
// triangle points
uniform vec2 u_vertices[3];

// vertex colors
uniform vec3 u_colors[3];

// REMOVE BEGIN
// edge function
float edge(vec2 p, vec2 v0, vec2 v1) {
    return (p.x-v0.x)*(v1.y-v0.y)-(p.y-v0.y)*(v1.x-v0.x);
}
// REMOVE END

void main(void)
{
    // TODO: return the correct color
    fragColor = vec4(1.0, 0.0, 1.0, 1.0);
    // REMOVE BEGIN
    // 1.5p edge function implementation
    // 1.5p: 0.5p per correct in/out check
    // 2p: total area and barycentric coordinates
    // 1p: color mixing

    // edge functions
    float e = edge(u_vertices[0], u_vertices[1], u_vertices[2]);
    float e0 = edge(v_uv, u_vertices[1], u_vertices[2]);
    float e1 = edge(v_uv, u_vertices[2], u_vertices[0]);
    float e2 = edge(v_uv, u_vertices[0], u_vertices[1]);

    // barycentric coordinates
    float w0 = e0/e;
    float w1 = e1/e;
    float w2 = e2/e;

    // triangle mask
    float triangle = step(0.0, e0) * step(0.0, e1) * step(0.0, e2);

    vec3 color = w0 * u_colors[0] + w1 * u_colors[1] + w2 * u_colors[2];
    color *= triangle;

    fragColor = vec4(color, 1.0);
    // REMOVE END
}
