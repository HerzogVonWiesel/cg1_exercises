import { maxHeaderSize } from 'http';
import { quat } from 'webgl-operate';

/**
 * Spherical linear interpolation. Used as helper for rotation based on
 * quaternions.
 * @param startQuat - First input quaternion
 * @param endQuat - Second input quaternion
 * @param t - Interpolation factor
 * @returns The interpolated value
 */
 const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);


export function slerp(startQuat: quat, endQuat: quat, t: number): quat {
    let outputQuat = quat.create();
    let alpha = 0.0;
    if(startQuat != endQuat) {
        alpha = Math.acos(clamp(quat.dot(startQuat, endQuat),-1.0, 1.0)); 
    }
    const fact_q1 = Math.sin((1-t)*alpha)/Math.sin(alpha);
    const fact_q2 = Math.sin(t*alpha)/Math.sin(alpha); 
    quat.scale(startQuat, startQuat, fact_q1);
    quat.scale(endQuat, endQuat, fact_q2);
    quat.add(outputQuat, startQuat, endQuat);
    return outputQuat;

    
    // TODO: implement slerp
    // HINT: clamp the cosine value to [-1, 1],
    // quat.dot can give faulty values if the input quaternions are the same


    
}
