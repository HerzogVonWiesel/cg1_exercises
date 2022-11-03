precision lowp float;

layout(location = 0) out vec4 fragColor;

// position in texture [0.0, 1.0]^2
in vec2 v_uv;

// factor to scale all metaballs
uniform float u_radiusFactor;
// resolution of the canvas in pixels
uniform vec2 u_resolution;
// visualization mode index
uniform int u_mode;
// metaballs: storing for each ball (x, y, radius) in a vec3
uniform vec3 u_metaballs[$NUMBER_OF_METABALLS];

//from https://gist.github.com/983/e170a24ae8eba2cd174f
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main(void)
{
    // TODO: implement metaball visualization
    // set fragColor to set the color of the pixel
    float density = 0.0;
    float aspect_ratio = u_resolution.x/u_resolution.y;
    for (int i = 0; i < u_metaballs.length(); i++){
        vec3 metaball = u_metaballs[i];
        density += pow((u_radiusFactor*metaball.z)/sqrt(pow(v_uv.x-metaball.x, 2.0)*aspect_ratio+pow(v_uv.y-metaball.y, 2.0)), 2.0);
    }
    if (u_mode == 0){
        //threshold
        if (density > 1.0){
            fragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
        else{
            fragColor = vec4(0.0, 0.0, 0.0, 1.0);
        }
    }
    else if (u_mode == 1){
        //psychedelic
        fragColor = vec4(hsv2rgb(vec3(mod(1.0/density,1.0), 1.0, 1.0)), 1.0);
    }
    else{
        //zebra
        float brightness = step(0.5, mod(1.0/density,1.0));
        fragColor = vec4(brightness, brightness, brightness, 1.0);
    }


}
