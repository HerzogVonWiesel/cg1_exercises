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
    vec4 vertexPosition3d = vec4(a_vertex, 0.0, 1.0);
    v_uv = a_vertex * 0.5 + 0.5;
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
