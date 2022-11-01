type args = { blurRadius: number };

/**
 * Box blur implemented using the CPU.
 * Loops over all pixels and uses the radius stored in this._blurRadius to
 * average all pixels in a square box to calculate the output values.
 */
export function blur(
    inputImage: Uint8Array, outputImage: Uint8Array,
    width: number, height: number, { blurRadius }: args
): void {
    // TODO: implement blur
}
