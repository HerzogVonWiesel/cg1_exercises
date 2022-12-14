import { Angles } from './angles';
import { intrinsic } from './kardan';
import { lerp } from './lerp';
import { mat4 } from 'webgl-operate';

/**
 * Rotation interpolation using euler angles.
 * @param startRotation - Rotation at the left side, stored as yaw,
 * pitch and roll euler angles
 * @param endRotation - Rotation at the right side, stored as yaw,
 * pitch and roll euler angles
 * @param t - Interpolation factor
 * @returns The interpolated rotation, stored as rotation matrix
 */
export function interpolateEuler(
    startRotation: Angles, endRotation: Angles, t: number
): mat4 {
    // TODO: implement rotation using euler angle interpolation
    // HINT: your implementation should use lerp
    const rot_angles = {
        roll: lerp(startRotation.roll, endRotation.roll, t),
        pitch: lerp(startRotation.pitch, endRotation.pitch, t),
        yaw: lerp(startRotation.yaw, endRotation.yaw, t)
    };
    const outputMatrix = intrinsic(rot_angles);


    return outputMatrix;
}
