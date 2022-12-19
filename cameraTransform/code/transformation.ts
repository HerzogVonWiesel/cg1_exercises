import {
    Camera,
    mat4,
    vec3
} from 'webgl-operate';
import { vertFovToHorFov } from './vertFovToHorFov';

// TODO: Implement all these functions.

/**
 * Calculates the LookAt (view transform) matrix.
 */
export function getLookAt(camera: Camera): mat4 {
    const eye = camera.eye;
    const transforMatrix = mat4.fromValues( 1, 0, 0, 0,
                                            0, 1, 0, 0,
                                            0, 0, 1, 0,
                                            -eye[0], -eye[1], -eye[2], 1);

    const F = vec3.create();
    vec3.sub(F, camera.center, camera.eye);
    const U = camera.up;
    const n = vec3.fromValues(-F[0], -F[1], -F[2]);
    vec3.normalize(n, n);
    const u = vec3.create();
    vec3.cross(u, U, n);
    vec3.normalize(u, u);
    const v = vec3.create();

    vec3.scale(v, F, vec3.dot(F, U)); //x
    vec3.sub(v, U, v); //x
    vec3.normalize(v, v); //x

    vec3.cross(u, v, n); //x

    //vec3.cross(v, u, n); //y
    const matRotate = mat4.fromValues(  u[0], u[1], u[2], 0,
                                        v[0], v[1], v[2], 0,
                                        n[0], n[1], n[2], 0,
                                        0, 0, 0, 1);

    console.log("Fuvn:");
    console.log(F);
    console.log(u);
    console.log(v);
    console.log(n);
    mat4.mul(transforMatrix, matRotate, transforMatrix);

    return transforMatrix;
}

/**
 * Adjusts both view angles (horizontal and vertical field of view) to 90°.
 */
export function getAngleAdjustment(camera: Camera): mat4 {

    return mat4.create();
}

/**
 * Uniform scaling to place far clipping plane at z=-1.
 */
export function getScaling(camera: Camera): mat4 {

    return mat4.create();
}

/**
 * Distorts the frustum into a cuboid.
 */
export function getPerspectiveTransform(camera: Camera): mat4 {

    return mat4.create();
}
