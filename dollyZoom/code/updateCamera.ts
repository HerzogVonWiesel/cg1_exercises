import {
    Camera,
    mat4,
    vec3
} from 'webgl-operate';

import { Rotation } from './rotation';
import { exp } from './exp';
import { getFov } from './getFov';
import { lerp } from './lerp';
import { smoothstep } from './smoothstep';

/**
 * Configures the camera.
 * @param viewTarget The scene's point of interest.
 * @param rotation Camera rotation around viewTarget.
 * @param minDist Minimum distance from the viewTarget.
 * @param maxDist Maximum distance from the viewTarget.
 * @param interpolateFactor Progress of interpolation between min and max dist.
 * @param focalWidth Size of the object in focus.
 * @param camera The camera object to manipulate.
 */

function degTorad (degrees: number): number {
	return degrees * Math.PI / 180;
}

export function updateCamera(
    viewTarget: vec3,
    rotation: Rotation,
    endrotation: Rotation,
    minDist: number,
    maxDist: number,
    interpolateFactor: number,
    focalWidth: number,
    camera: Camera,
): void {
    // use an exponential function to slow down movement when closer
    const slow = exp(interpolateFactor, 7);
    // and use smooth acceleration for moving
    const smooth = smoothstep(0, 1, slow);

    /**
     * Values you should use:
     *
     * viewTarget: Based on the selected model, this variable contains the
     * scene's point of interest.
     *
     * rotation: Camera rotation. Uses a longitude/latitude system,
     * with values being stored as radians.
     *
     * smooth: Contains a "better" version of the interpolationFactor,
     * which makes the animation look smoother. It is recommended to use
     * this instead of the default interpolation factor.
     *
     * minDist: Minimum distance from the viewTarget (when the
     * interpolation factor is 0).
     *
     * maxDist: Maximum distance from the viewTarget (when the
     * interpolation factor is 1).
     *
     * focalWidth: Size of the area that's in focus.
     */

    // TODO: set correct camera properties
    // center - the point the camera looks at
    camera.center = viewTarget;
    // eye - the camera's position
    const camPos = vec3.create();
    const distance = lerp(minDist, maxDist, smooth);
    const zPos = vec3.fromValues(0, 0, 1);
    vec3.rotateX(zPos, zPos, vec3.fromValues(0, 0, 0), degTorad(rotation.latitude));
    vec3.rotateY(zPos, zPos, vec3.fromValues(0, 0, 0), degTorad(rotation.longitude));
    const endzPos = vec3.fromValues(0, 0, 1);
    vec3.rotateX(endzPos, endzPos, vec3.fromValues(0, 0, 0), degTorad(endrotation.latitude));
    vec3.rotateY(endzPos, endzPos, vec3.fromValues(0, 0, 0), degTorad(endrotation.longitude));
    vec3.lerp(zPos, zPos, endzPos, smooth);
    vec3.normalize(zPos, zPos);
    vec3.scale(zPos, zPos, distance);
    vec3.add(camPos, viewTarget, zPos);
    camera.eye = camPos;
    // up - y axis of the camera
    const lookAt = vec3.create();
    vec3.sub(lookAt, camera.center, camera.eye);
    vec3.normalize(lookAt, lookAt);
    const right = vec3.create();
    vec3.cross(right, lookAt, vec3.fromValues(0, 1, 0));
    const up = vec3.create();
    vec3.cross(up, right, lookAt);
    camera.up = up;
    // fovy - the camera's vertical field of view
    const fovy = getFov(distance, focalWidth);
    camera.fovy = fovy;

}
