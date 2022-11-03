type args = { blurRadius: number };

/**
 * Box blur implemented using the CPU.
 * Loops over all pixels and uses the radius stored in this._blurRadius to
 * average all pixels in a square box to calculate the output values.
 */
function get_rgb(image: Uint8Array, u: number, v: number, width: number){
    const r = image[u*3 + v*width*3 + 0];
    const g = image[u*3 + v*width*3 + 1];
    const b = image[u*3 + v*width*3 + 2];
    return [r, g, b];
}

function set_rgb(image: Uint8Array, u:number, v: number, width: number, rgb: number[]){
    image[u*3 + v*width*3 + 0] = rgb[0];
    image[u*3 + v*width*3 + 1] = rgb[1];
    image[u*3 + v*width*3 + 2] = rgb[2];
}

export function blur(
    inputImage: Uint8Array, outputImage: Uint8Array,
    width: number, height: number, { blurRadius }: args
): void {
    // TODO: implement blur
    const weight_factor = (2*blurRadius+1) * (2*blurRadius+1);
    for (let v=0; v < height; v++){
        for (let u=0; u < width; u++){
            const pixelcolor = [0.0, 0.0, 0.0];
            for (let v_it = -blurRadius; v_it <= blurRadius; v_it++){
                for (let u_it = -blurRadius; u_it <= blurRadius; u_it++){
                    const pixelvalue = get_rgb(inputImage, u+u_it, v+v_it, width);
                    pixelcolor[0] += pixelvalue[0] * 1/weight_factor;
                    pixelcolor[1] += pixelvalue[1] * 1/weight_factor;
                    pixelcolor[2] += pixelvalue[2] * 1/weight_factor;
                }
            }
            set_rgb(outputImage, u, v, width, pixelcolor);
        }
    }
}
