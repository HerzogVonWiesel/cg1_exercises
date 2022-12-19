import {
    Camera,
    mat4,
    vec3
} from 'webgl-operate';
import { vertFovToHorFov } from './vertFovToHorFov';

// Convert from degrees to radians.
function degTorad (degrees: number): number {
	return degrees * Math.PI / 180;
}

// Convert from radians to degrees.
function radTodeg (radians: number): number {
	return radians * 180 / Math.PI;
}

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

    // vec3.scale(v, F, vec3.dot(F, U)); //x
    // vec3.sub(v, U, v); //x
    // vec3.normalize(v, v); //x

    // vec3.cross(u, v, n); //x

    vec3.cross(v, n, u); //y
    const matRotate = mat4.fromValues(  u[0], v[0], n[0], 0,
                                        u[1], v[1], n[1], 0,
                                        u[2], v[2], n[2], 0,
                                        0, 0, 0, 1);

    mat4.mul(transforMatrix, matRotate, transforMatrix);

    return transforMatrix;
}

/**
 * Adjusts both view angles (horizontal and vertical field of view) to 90°.
 */
export function getAngleAdjustment(camera: Camera): mat4 {

    const fovy = degTorad(camera.fovy);
    const fovx = vertFovToHorFov(fovy, camera.aspect);

    const cotx = 1/Math.tan(fovx/2);
    const coty = 1/Math.tan(fovy/2);

    const matScale = mat4.fromValues(   cotx, 0, 0, 0,
                                        0, coty, 0, 0,
                                        0, 0, 1, 0,
                                        0, 0, 0, 1);

    return matScale;
}

/**
 * Uniform scaling to place far clipping plane at z=-1.
 */
export function getScaling(camera: Camera): mat4 {

    const normalized_far = 1/camera.far;

    const matScale = mat4.fromValues(   normalized_far, 0, 0, 0,
                                        0, normalized_far, 0, 0,
                                        0, 0, normalized_far, 0,
                                        0, 0, 0, 1);

    return matScale;
}

/**
 * Distorts the frustum into a cuboid.
 */
export function getPerspectiveTransform(camera: Camera): mat4 {

    const k = camera.near/camera.far;

    const matShear = mat4.fromValues(   1, 0, 0, 0,
                                        0, 1, 0, 0,
                                        0, 0, 1/(k-1), -1,
                                        0, 0, k/(k-1), 0);

    return matShear;
}
