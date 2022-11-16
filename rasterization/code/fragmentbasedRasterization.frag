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

float edge_func(vec2 v0, vec2 v1, vec2 point){
    float epsilon = (point.x-v0.x)*(v1.y-v0.y)-(point.y-v0.y)*(v1.x-v0.x);
    return epsilon;
}

float tri_area(vec2 v0, vec2 v1, vec2 v2){
    v1 = v1-v0;
    v2 = v2-v0;
    return length(cross(vec3(v1, 0.0), vec3(v2, 0.0)));
}

void main(void)
{
    fragColor = vec4(0.0, 0.0, 0.0, 1.0);
    // TODO: return the correct color
    if(edge_func(u_vertices[0], u_vertices[1], v_uv) > 0.0 && edge_func(u_vertices[1], u_vertices[2], v_uv) > 0.0 && edge_func(u_vertices[2], u_vertices[0], v_uv) > 0.0){
        float total_area = tri_area(u_vertices[0], u_vertices[1], u_vertices[2]);
        float alpha = tri_area(u_vertices[1], u_vertices[2], v_uv)/total_area;
        float beta  = tri_area(u_vertices[2], u_vertices[0], v_uv)/total_area;
        float gamma = tri_area(u_vertices[0], u_vertices[1], v_uv)/total_area;
        fragColor = vec4(alpha * u_colors[0] + beta * u_colors[1] + gamma * u_colors[2], 1.0);
    }

}
