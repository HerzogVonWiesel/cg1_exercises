precision lowp float;

// TODO: use vertex and fragment shader together to create the same result

layout(location = 0) out vec4 fragColor;

uniform vec3 u_colors[3];

// REMOVE BEGIN
in vec3 v_color;
// REMOVE END

void main(void)
{
    // TODO: return the correct color
    fragColor = vec4(1.0, 0.0, 1.0, 1.0);
    // REMOVE BEGIN
    // 1p: in var decl and usage
    fragColor = vec4(v_color, 1.0);
    // REMOVE END
}
