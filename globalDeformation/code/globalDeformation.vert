precision highp float;

// Adapted from https://github.com/KhronosGroup/glTF-WebGL-PBR

const int HAS_NORMALS           = 1;
const int HAS_TANGENTS          = 1 << 1;
const int HAS_UV                = 1 << 2;
const int HAS_COLORS            = 1 << 3;

layout (location = 0) in vec4 a_position;
layout (location = 1) in vec3 a_normal;
layout (location = 2) in vec4 a_tangent;
layout (location = 3) in vec2 a_texcoord_0;
layout (location = 4) in vec2 a_texcoord_1;
layout (location = 5) in vec2 a_texcoord_2;
layout (location = 6) in vec4 a_joints;
layout (location = 7) in vec4 a_weights;
layout (location = 8) in vec4 a_color;

uniform mat4 u_model;
uniform mat4 u_viewProjection;
uniform mat3 u_normalMatrix;

uniform mediump int u_geometryFlags;

uniform vec3 u_min;
uniform vec3 u_max;

uniform float u_moldFactor;
uniform float u_pinchFactor;
uniform float u_twistAngle;
uniform float u_bendAngle;

out vec2 v_uv[3];
out vec4 v_color;
out vec3 v_position;

out mat3 v_TBN;
out vec3 v_normal;

const float M_PI = 3.141592653589793;

bool checkFlag(int flag) {
    return (u_geometryFlags & flag) == flag;
}

vec4 mold(vec4 vertex, float factor, vec3 extents)
{
    ////////////////////////////////////////////////////////////////////////////
    // TODO:
    // Apply a mold deformation to the given vertex.
    // Take into account the factor parameter
    //      0.0: No deformation at all
    //      1.0: Maximum deformation
    // The model is centered in the coordinate origin.
    // The extends variable contains the maximum value for each dimension,
    // calculated as max(abs(u_min), u_max).
    ////////////////////////////////////////////////////////////////////////////
    float dotter = dot(vec3(vertex.x, 0.0, vertex.z), vec3(0.0,0.0,1.0));
    dotter /= length(vertex.xz);
    dotter = (acos(-abs(dotter))-(M_PI/2.0))/(M_PI/2.0);
    dotter = mix(1.0, dotter, factor);
    vertex.z *= dotter;
    vertex /= vertex.w;

    return vertex;
}

vec4 pinch(vec4 vertex, float factor, vec3 extents)
{
    ////////////////////////////////////////////////////////////////////////////
    // TODO:
    // Apply a pinch deformation to the given vertex.
    // Take into account the factor parameter
    //      0.0: No deformation at all
    //      1.0: Maximum deformation
    // The model is centered in the coordinate origin.
    // The extends variable contains the maximum value for each dimension,
    // calculated as max(abs(u_min), u_max).
    ////////////////////////////////////////////////////////////////////////////
    float max_x =mix(extents.x, 0.0, (vertex.y+extents.y)*factor);
    //float nu_x = mix(vertex.x, 0.0, (vertex.y+extents.y)*factor);
    vertex.x = mix(vertex.x, max_x, step(max_x, vertex.x));
    vertex.x = mix(-max_x, vertex.x, step(-max_x, vertex.x));
    vertex /= vertex.w;

    return vertex;
}

vec4 twist(vec4 vertex, float angle, vec3 extents)
{
    ////////////////////////////////////////////////////////////////////////////
    // TODO:
    // Apply a twist deformation to the given vertex.
    // Take into account the angle parameter, that defines the maximum rotation
    // angle (given in radians)
    // The model is centered in the coordinate origin.
    // The extends variable contains the maximum value for each dimension,
    // calculated as max(abs(u_min), u_max).
    ////////////////////////////////////////////////////////////////////////////
    float normalized_y = (vertex.y/extents.y) + 1.0;
    float theta = -0.5*normalized_y*angle;
    mat4 rot_mat = mat4(cos(theta), 0.0, sin(theta), 0.0,
                    0.0, 1.0, 0.0, 0.0,
                    -sin(theta), 0.0, cos(theta), 0.0,
                    0.0, 0.0, 0.0, 1.0);
    vertex = rot_mat * vertex;

    return vertex;
}

vec4 bend(vec4 vertex, float angle, vec3 extents)
{
    ////////////////////////////////////////////////////////////////////////////
    // TODO:
    // Apply a bend deformation to the given vertex.
    // Take into account the angle parameter, that defines the maximum rotation
    // angle (given in radians)
    // The model is centered in the coordinate origin.
    // The extends variable contains the maximum value for each dimension,
    // calculated as max(abs(u_min), u_max).
    ////////////////////////////////////////////////////////////////////////////
    float normalized_y = (vertex.y/extents.y)+1.0;
    float theta = -0.5*normalized_y*angle;
    mat4 rot_mat = mat4(cos(theta), -sin(theta), 0.0, 0.0,
                    sin(theta), cos(theta), 0.0, 0.0,
                    0.0, 0.0, 1.0, 0.0,
                    0.0, 0.0, 0.0, 1.0);
    vertex = rot_mat * vertex;

    return vertex;
}

vec4 applyDeformations(vec4 vertex) {
    vec3 extents = max(abs(u_min), u_max);
    vertex = mold(vertex, u_moldFactor, extents);
    vertex = pinch(vertex, u_pinchFactor, extents);
    vertex = twist(vertex, u_twistAngle, extents);
    vertex = bend(vertex, u_bendAngle, extents);
    return vertex;
}

void main(void)
{
    vec4 pos = u_model * a_position;
    v_position = vec3(pos.xyz) / pos.w;

    vec4 vertex = applyDeformations(vec4(v_position, 1.0));

    if (checkFlag(HAS_NORMALS)) {
        if (checkFlag(HAS_TANGENTS)) {
            vec3 normalW = normalize(vec3(u_normalMatrix * a_normal));
            vec3 tangentW = normalize(vec3(u_model * vec4(a_tangent.xyz, 0.0)));
            vec3 bitangentW = cross(normalW, tangentW) * a_tangent.w;
            v_TBN = mat3(tangentW, bitangentW, normalW);
        } else { // HAS_TANGENTS != 1
            v_normal = normalize(vec3(u_model * vec4(a_normal.xyz, 0.0)));
        }
    }

    if (checkFlag(HAS_UV)) {
        v_uv[0] = a_texcoord_0;
        v_uv[1] = a_texcoord_1;
        v_uv[2] = a_texcoord_2;
    } else {
        v_uv[0] = vec2(0., 0.);
        v_uv[1] = vec2(0., 0.);
        v_uv[2] = vec2(0., 0.);
    }

    if (checkFlag(HAS_COLORS)) {
        v_color = a_color;
    } else {
        v_color = vec4(1.0);
    }

    gl_Position = u_viewProjection * vertex;
}
