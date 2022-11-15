precision lowp float;

// TODO: use vertex and fragment shader together to create the same result

in vec2 a_vertex;
in vec3 a_color;

// REMOVE BEGIN
out vec3 v_color;
// REMOVE END

void main(void)
{
    // REMOVE BEGIN
    // 1p: out var decl and assignment
    v_color = a_color;
    // REMOVE END
    gl_Position = vec4(a_vertex, 0.0, 1.0);
}
