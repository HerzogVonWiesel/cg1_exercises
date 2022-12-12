import { mat4, vec3 } from 'webgl-operate';
import { Angles } from './angles';

// HINT: use mat4.fromX/Y/ZRotation and mat4.mul for rotation
// mat4.rotateX/Y/Z multiplies a rotation matrix on the right, which is unusual

export function intrinsic(angles: Angles): mat4 {
    const mat = mat4.create();
    mat4.rotateY(mat, mat, angles.yaw);
    mat4.rotateX(mat, mat, angles.pitch);
    mat4.rotateZ(mat, mat, angles.roll);
    return mat;
}

export function extrinsic(angles: Angles): mat4 {
    const mat = mat4.create();
    const mat1 = mat4.create();
    const mat2 = mat4.create();
    const mat3 = mat4.create();
    mat4.fromZRotation(mat1, angles.roll);
    mat4.fromXRotation(mat2, angles.pitch);
    mat4.fromYRotation(mat3, angles.yaw);
    mat4.mul(mat, mat2, mat1);
    mat4.mul(mat, mat3, mat);

    return mat;
}
