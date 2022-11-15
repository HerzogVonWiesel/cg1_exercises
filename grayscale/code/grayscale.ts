import Jimp from 'jimp';

// Keep the image as is.
export function original(input: Jimp): Jimp {
    return input.clone();
}

// Convert the image into a gray scale image
// by averaging the color channels.
export function averageGray(input: Jimp): Jimp {
    const output = new Jimp(input.getWidth(), input.getHeight());
    // TODO: implement this function
    for (let u=0; u < input.getWidth(); u++){
        for (let v=0; v < input.getHeight(); v++){
            const pixelcolor = Jimp.intToRGBA(input.getPixelColor(u, v));
            const brightness = (pixelcolor.r + pixelcolor.g + pixelcolor.b)/3;
            output.setPixelColor(
                Jimp.rgbaToInt(brightness, brightness, brightness, pixelcolor.a),
                u, v);
        }
    }

    return output;
}

// Convert the image into a gray scale image by weighting the color channels
// to get image better representing human luminance perception.
function weightedGray(input: Jimp): Jimp {
    const output = new Jimp(input.getWidth(), input.getHeight());
    // TODO: implement this function
    for (let u=0; u < input.getWidth(); u++){
        for (let v=0; v < input.getHeight(); v++){
            const pixelcolor = Jimp.intToRGBA(input.getPixelColor(u, v));
            const brightness = (pixelcolor.r*0.2126 + pixelcolor.g*0.7152 + pixelcolor.b*0.0722);
            output.setPixelColor(Jimp.rgbaToInt(brightness, brightness, brightness, pixelcolor.a), u, v);
        }
    }
    return output;
}

// Convert the image into a black-and-white image by thresholding.
// (You might want to convert it to a gray scale image first.)
function threshold(input: Jimp): Jimp {
    const output = new Jimp(input.getWidth(), input.getHeight());
    // TODO: implement this function
    const thresholdvalue = 0.5 * 255;
    for (let u=0; u < input.getWidth(); u++){
        for (let v=0; v < input.getHeight(); v++){
            const pixelcolor = Jimp.intToRGBA(input.getPixelColor(u, v));
            let brightness = (pixelcolor.r*0.2126 + pixelcolor.g*0.7152 + pixelcolor.b*0.0722);
            brightness = ((brightness > thresholdvalue)? 255 : 0);
            output.setPixelColor(Jimp.rgbaToInt(brightness, brightness, brightness, pixelcolor.a), u, v);
        }
    }
    return output;
}

// Convert the image into a black-and-white image with error diffusion
// as described by Floyd and Steinberg.
// (You might want to convert it to a gray scale image first.)
function push_delta(output: Jimp, delta: number, delta_factor: number, u: number, v: number): void{
    const pixelcolor = Jimp.intToRGBA(output.getPixelColor(u, v));
    let pixelvalue = pixelcolor.r;
    pixelvalue = pixelvalue + delta*delta_factor;
    pixelvalue = (pixelvalue > 255)? 255 : pixelvalue;
    pixelvalue = (pixelvalue < 0)? 0 : pixelvalue;
    output.setPixelColor(Jimp.rgbaToInt(pixelvalue, pixelvalue, pixelvalue, pixelcolor.a), u, v);
}

function floydSteinberg(input: Jimp): Jimp {
    const output = new Jimp(input.getWidth(), input.getHeight());
    const greyscale_img = weightedGray(input);

    const thresholdvalue = 0.5 * 255;
    for (let v=0; v < input.getHeight(); v++){
        for (let u=0; u < input.getWidth(); u++){
            const pixelcolor = Jimp.intToRGBA(greyscale_img.getPixelColor(u, v));
            const pixel_reduced = (pixelcolor.r > thresholdvalue)? 255 : 0;
            const delta = pixelcolor.r - pixel_reduced;
            if (u != input.getWidth()-1)
                push_delta(greyscale_img, delta, 7/16, u+1, v);
            if (v != input.getHeight()-1){
                if (u != 0)
                    push_delta(greyscale_img, delta, 3/16, u-1, v+1);
                push_delta(greyscale_img, delta, 5/16, u, v+1);
                push_delta(greyscale_img, delta, 1/16, u+1, v+1);
            }
            output.setPixelColor(Jimp.rgbaToInt(pixel_reduced, pixel_reduced, pixel_reduced, pixelcolor.a), u, v);
        }
    }

    return output;
}

const algorithms = new Map<string, (i: Jimp) => Jimp>([
    ['Original', original],
    ['Grau: Durchschnitt', averageGray],
    ['Grau: Gewichtet', weightedGray],
    ['Schwellwert', threshold],
    ['Floyd-Steinberg', floydSteinberg]
]);
const Algorithms = [...algorithms.keys()];

function process(
    image: Jimp,
    algorithm: string
): Jimp {
    return algorithms.get(algorithm)?.(image);
}

export {
    Algorithms,
    process
};
