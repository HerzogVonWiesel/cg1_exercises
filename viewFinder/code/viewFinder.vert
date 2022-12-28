precision highp float;

uniform sampler2D u_texture;
uniform int u_geometryResolution;

// the position from where the image should look normal
uniform vec3 u_correctViewPosition;

// camera view projection
uniform mat4 u_viewProjection;

// the vertex position [-1, 1]
in vec2 a_vertex;

// the uv coordinates for texture sampling – must be set correctly in getPosition()
out vec2 v_uv;

// noise function returning a pseudo random number based on an seed
float rand(int seed){return fract(sin(float(seed)) * 43758.5453123);}


vec4 getPosition(
    int id,
    float distanceToCorrectViewPosition,
    vec2 resolution
) {
    // TODO: calculate the vertexPosition3d and also set v_uv correctly
    vec2 offset = vec2(float(id % u_geometryResolution), float(id/u_geometryResolution));
    offset = 2.0*offset - float(u_geometryResolution-1);
    float aspect_ratio = resolution.x/resolution.y;
    offset.x *= aspect_ratio;
    vec2 og_vertex_pos = vec2(a_vertex.x*aspect_ratio + offset.x, a_vertex.y + offset.y);
    og_vertex_pos /= float(u_geometryResolution);
    offset /= float(u_geometryResolution);
    v_uv.x = og_vertex_pos.x/aspect_ratio * 0.5 + 0.5;
    v_uv.y = og_vertex_pos.y * 0.5 + 0.5;

    float z_dist = distanceToCorrectViewPosition;
    z_dist = sqrt(abs(z_dist*z_dist - length(offset)*length(offset)));
    og_vertex_pos *= z_dist/u_correctViewPosition.z;


    vec4 vertexPosition3d = vec4(og_vertex_pos, u_correctViewPosition.z-z_dist, 1.0);
    return vertexPosition3d;
}

void main(void)
{
    // resolution of the texture in pixel
    vec2 resolution = vec2(textureSize(u_texture, 0));

    // the distance the center of the current rectangle instance shold have to
    // the correct view position
    float distanceToCorrectViewPosition = rand(gl_InstanceID) * 2.0 + 1.0;

    // get the 3D position
    vec4 position = getPosition(
        gl_InstanceID,
        distanceToCorrectViewPosition,
        resolution
    );

    // apply camera view projection
    gl_Position = u_viewProjection * position;
}
