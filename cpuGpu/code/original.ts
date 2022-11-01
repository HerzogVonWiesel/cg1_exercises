/**
 * Processing function for GPU based effects.
 * Copies the values without changing them.
 */
export function original(
    inputImage: Uint8Array, outputImage: Uint8Array,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    width: number, height: number
): void {
    outputImage.set(inputImage, 0);
}
