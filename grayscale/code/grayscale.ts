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
    return output;
}

// Convert the image into a gray scale image by weighting the color channels
// to get image better representing human luminance perception.
function weightedGray(input: Jimp): Jimp {
    const output = new Jimp(input.getWidth(), input.getHeight());
    // TODO: implement this function
    return output;
}

// Convert the image into a black-and-white image by thresholding.
// (You might want to convert it to a gray scale image first.)
function threshold(input: Jimp): Jimp {
    const output = new Jimp(input.getWidth(), input.getHeight());
    // TODO: implement this function
    return output;
}

// Convert the image into a black-and-white image with error diffusion
// as described by Floyd and Steinberg.
// (You might want to convert it to a gray scale image first.)
function floydSteinberg(input: Jimp): Jimp {
    const output = new Jimp(input.getWidth(), input.getHeight());
    // TODO: implement this function
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
