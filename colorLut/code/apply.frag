precision mediump float;

// uniform input values are shared between fragments
// input image
uniform sampler2D u_image;
// LUT
uniform sampler2D u_lut;
// LUT resolution for one component (4, 8, 16, ...)
uniform float u_resolution;

layout(location = 0) out vec4 fragColor;

// varying input values are set by the vertex shader
// texture coordinate of current fragment
in vec2 v_uv;

ivec2 i_flatten(ivec3 vector, float resolution){
    ivec2 result = ivec2(vector.x+int(resolution)*vector.z, vector.y);
    return result;
}

void main(void)
{
    // TODO: use the LUT to apply effects to the input texture
    // hint: use texelFetch to get a texture value without interpolation
    // this will require an integer vector (ivec2)
    vec3 inColor = texture(u_image, v_uv).rgb;

    vec3 mixFactor = fract(inColor*(u_resolution-1.0));
    ivec3 basePos = ivec3(inColor*(u_resolution-1.0));
    vec4 col_000 = texelFetch(u_lut, i_flatten(basePos + ivec3(0,0,0), u_resolution), 0);
    vec4 col_001 = texelFetch(u_lut, i_flatten(basePos + ivec3(0,0,1), u_resolution), 0);
    vec4 col_010 = texelFetch(u_lut, i_flatten(basePos + ivec3(0,1,0), u_resolution), 0);
    vec4 col_011 = texelFetch(u_lut, i_flatten(basePos + ivec3(0,1,1), u_resolution), 0);
    vec4 col_100 = texelFetch(u_lut, i_flatten(basePos + ivec3(1,0,0), u_resolution), 0);
    vec4 col_101 = texelFetch(u_lut, i_flatten(basePos + ivec3(1,0,1), u_resolution), 0);
    vec4 col_110 = texelFetch(u_lut, i_flatten(basePos + ivec3(1,1,0), u_resolution), 0);
    vec4 col_111 = texelFetch(u_lut, i_flatten(basePos + ivec3(1,1,1), u_resolution), 0);

    vec4 col_x00 = mix(col_000, col_100, mixFactor.x);
    vec4 col_x10 = mix(col_010, col_110, mixFactor.x);
    vec4 col_x01 = mix(col_001, col_101, mixFactor.x);
    vec4 col_x11 = mix(col_011, col_111, mixFactor.x);

    vec4 col_xx0 = mix(col_x00, col_x10, mixFactor.y);
    vec4 col_xx1 = mix(col_x01, col_x11, mixFactor.y);

    vec4 col_xxx = mix(col_xx0, col_xx1, mixFactor.z);
    fragColor = col_xxx;

}
