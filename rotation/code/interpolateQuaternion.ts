import {
    mat4,
    quat,
    vec3
} from 'webgl-operate';

import { Angles } from './angles';
import { intrinsic } from './kardan';
import { slerp } from './slerp';

/**
 * Rotation interpolation using quaternions.
 * @param startRotation - Rotation at the left side, stored as yaw,
 * pitch and roll euler angles
 * @param endRotation - Rotation at the right side, stored as yaw,
 * pitch and roll euler angles
 * @param t - Interpolation factor
 * @returns The interpolated rotation, stored as rotation matrix
 */
export function interpolateQuaternion(
    startRotation: Angles, endRotation: Angles, t: number
): mat4 {
    // TODO: implement rotation using quaternion interpolation
    // HINT: your implementation should use slerp
    let mat = mat4.create();
    const start_quat = quat.create();
    const end_quat = quat.create();
    //const degree_conv = (180.0/Math.PI);
    
    quat.rotateY(start_quat, start_quat, startRotation.yaw);
    quat.rotateX(start_quat, start_quat, startRotation.pitch);
    quat.rotateZ(start_quat, start_quat, startRotation.roll);

    quat.rotateY(end_quat, end_quat, endRotation.yaw);
    quat.rotateX(end_quat, end_quat, endRotation.pitch);
    quat.rotateZ(end_quat, end_quat, endRotation.roll);

    const rot_quat = slerp(start_quat, end_quat, t);
    mat4.fromQuat(mat, rot_quat);

    //quat.fromEuler(start_quat, startRotation.pitch*degree_conv, startRotation.yaw*degree_conv, startRotation.roll*degree_conv);
    //quat.fromEuler(end_quat, endRotation.pitch*degree_conv, endRotation.yaw*degree_conv, endRotation.roll*degree_conv);

    return mat;
}
