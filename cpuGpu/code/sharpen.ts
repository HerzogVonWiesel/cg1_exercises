/**
 * Image sharpening implemented using the CPU.
 * Loops over all pixels and uses the given kernel to subtract the
 * neighboring pixels. This will result in higher differences between
 * pixels, which make the image seem sharper.
 */
export function sharpen(
    inputImage: Uint8Array, outputImage: Uint8Array,
    width: number, height: number
): void {
    // kernel for weighting the neighboring pixels
    const kernel = [
        [0, -1, 0],
        [-1, 5, -1],
        [0, -1, 0],
    ];

    // loop over all pixels
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            // prepare a sum for each color channel
            let rSum = 0;
            let gSum = 0;
            let bSum = 0;
            // loop over the blur kernel in x direction
            for (let i = -1; i <= 1; i++) {
                // calculate x index for sample
                const sampleX = x + i;
                // ensure index is inside image
                if (sampleX < 0 || sampleX >= width) {
                    continue;
                }
                // loop over the blur kernel in y direction
                for (let j = -1; j <= 1; j++) {
                    // calculate y index for sample
                    const sampleY = y + j;
                    // ensure index is inside image
                    if (sampleY < 0 || sampleY >= height) {
                        continue;
                    }
                    // calculate pixel index in buffer
                    const index = (sampleX + sampleY * width) * 3;
                    // read weighting value from kernel
                    const kernelValue = kernel[j + 1][i + 1];
                    // sample pixel, apply weight, increase sums
                    rSum += inputImage[index] * kernelValue;
                    gSum += inputImage[index + 1] * kernelValue;
                    bSum += inputImage[index + 2] * kernelValue;
                }
            }
            // calculate index of output pixel
            const index = (x + y * width) * 3;
            // ensure value stays in range and store in output
            outputImage[index] = Math.max(Math.min(rSum, 255), 0);
            outputImage[index + 1] = Math.max(Math.min(gSum, 255), 0);
            outputImage[index + 2] = Math.max(Math.min(bSum, 255), 0);
        }
    }
}
