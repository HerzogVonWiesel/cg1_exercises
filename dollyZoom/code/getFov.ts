/**
 * Calculates the FOV for the dolly zoom effect.
 * @param distance - The camera's distance from the target.
 * @param width - The size of the scene that's supposed to be in focus.
 * @returns Resulting FOV, keeping the focus object the same size on screen.
 */
// Convert from radians to degrees.
function radTodeg (radians: number): number {
	return radians * 180 / Math.PI;
}

export function getFov(distance: number, width: number): number {

    const aspect = 9/16;
    const fovx = Math.atan(width/(2*distance))*2;
    const fovy = 2*Math.atan(Math.tan(fovx/2)*aspect);

    // TODO: calculate the fov
    return radTodeg(fovy);
}
