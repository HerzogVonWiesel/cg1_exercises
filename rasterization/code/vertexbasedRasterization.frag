precision lowp float;

// TODO: use vertex and fragment shader together to create the same result

layout(location = 0) out vec4 fragColor;

uniform vec3 u_colors[3];

in vec3 v_Position;


void main(void)
{
    // TODO: return the correct color
    fragColor = vec4(v_Position, 1.0);

}
