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

// REMOVE BEGIN
ivec2 i3_i2(ivec3 p)
{
    return ivec2(p.x + p.z * int(u_resolution), p.y);
}
// REMOVE END

void main(void)
{
    // TODO: use the LUT to apply effects to the input texture
    // hint: use texelFetch to get a texture value without interpolation
    // this will require an integer vector (ivec2)
    fragColor = texture(u_image, v_uv);
    // REMOVE BEGIN
    // 0.5p fetch orig image
    // 1p coord calc
    // 2.5p 8x texelFetch + trilinear filtering
    vec3 inColor = texture(u_image, v_uv).rgb;

    float steps = u_resolution - 1.0;
    vec3 f3Pos = steps * inColor;
    ivec3 lowerPos = ivec3(f3Pos);
    vec3 mixFactors = f3Pos - floor(f3Pos); // or fract(f3Pos)

    vec3 c000 = texelFetch(u_lut, i3_i2(lowerPos + ivec3(0, 0, 0)), 0).rgb;
    vec3 c001 = texelFetch(u_lut, i3_i2(lowerPos + ivec3(0, 0, 1)), 0).rgb;
    vec3 c010 = texelFetch(u_lut, i3_i2(lowerPos + ivec3(0, 1, 0)), 0).rgb;
    vec3 c011 = texelFetch(u_lut, i3_i2(lowerPos + ivec3(0, 1, 1)), 0).rgb;
    vec3 c100 = texelFetch(u_lut, i3_i2(lowerPos + ivec3(1, 0, 0)), 0).rgb;
    vec3 c101 = texelFetch(u_lut, i3_i2(lowerPos + ivec3(1, 0, 1)), 0).rgb;
    vec3 c110 = texelFetch(u_lut, i3_i2(lowerPos + ivec3(1, 1, 0)), 0).rgb;
    vec3 c111 = texelFetch(u_lut, i3_i2(lowerPos + ivec3(1, 1, 1)), 0).rgb;
    vec3 c00 = mix(c000, c001, mixFactors.b);
    vec3 c01 = mix(c010, c011, mixFactors.b);
    vec3 c10 = mix(c100, c101, mixFactors.b);
    vec3 c11 = mix(c110, c111, mixFactors.b);
    vec3 c0 = mix(c00, c01, mixFactors.g);
    vec3 c1 = mix(c10, c11, mixFactors.g);
    vec3 c = mix(c0, c1, mixFactors.r);

    fragColor = vec4(c, 1.0);
    // REMOVE END
}
