/**
 * Laplace edge detection implemented using the CPU.
 * Loops over all pixels and uses the given kernel to calculate a local
 * gradient. Areas without edges will turn out black, since the differences
 * are small, while areas with high differences will stand out.
 */
 function get_rgb(image: Uint8Array, u: number, v: number, width: number, height: number){
    u = (u < 0)? 0 : ((u > width-1)? width-1 : u);
    v = (v < 0)? 0 : ((v > height-1)? height-1 : v);
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

export function laplace(
    inputImage: Uint8Array, outputImage: Uint8Array,
    width: number, height: number
): void {

    // TODO: set correct kernel
    // kernel for weighting the neighboring pixels
    // custom kernel modified from https://aishack.in/tutorials/sobel-laplacian-edge-detectors/
    const kernel = [
        [-1, -2, -1],
        [-2, 12, -2],
        [-1, -2, -1],
    ];

    for (let v=0; v < height; v++){
        for (let u=0; u < width; u++){
            const pixelcolor = [0.0, 0.0, 0.0];
            for (let v_it = -1; v_it <= 1; v_it++){
                for (let u_it = -1; u_it <= 1; u_it++){
                    const pixelvalue = get_rgb(inputImage, u+u_it, v+v_it, width, height);
                    pixelcolor[0] += pixelvalue[0] * kernel[v_it+1][u_it+1];
                    pixelcolor[1] += pixelvalue[1] * kernel[v_it+1][u_it+1];
                    pixelcolor[2] += pixelvalue[2] * kernel[v_it+1][u_it+1];
                }
            }
            pixelcolor[0] = (pixelcolor[0] < 0)? 0 : ((pixelcolor[0] > 255)? 255 : pixelcolor[0]);
            pixelcolor[1] = (pixelcolor[1] < 0)? 0 : ((pixelcolor[1] > 255)? 255 : pixelcolor[1]);
            pixelcolor[2] = (pixelcolor[2] < 0)? 0 : ((pixelcolor[2] > 255)? 255 : pixelcolor[2]);
            set_rgb(outputImage, u, v, width, pixelcolor);
        }
    }

    // TODO: implement edge detection

}
