import { Algorithms, process } from './grayscale';
import { addFullscreenCheckbox, setupFullscreen } from 'helper/fullscreen';
import Jimp from 'jimp';
import { UI } from '@lukaswagner/web-ui';
import images from '../../data/images';

const container =
    document.getElementById('content-container') as HTMLDivElement;
const canvas =
    document.getElementById('content') as HTMLCanvasElement;

setupFullscreen(container, canvas);


const ctx = canvas.getContext('2d');

const controls = document.getElementById('controls') as HTMLDivElement;
const ui = new UI(controls);
addFullscreenCheckbox(container, ui);

let originalImage: Jimp;

async function display(): Promise<void> {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const image = originalImage.clone();
    image.cover(w, h);
    image.scale(1 / pixelSizeInput.value);

    const processed = process(image, algorithmSelect.value);
    processed.contain(w, h, undefined, Jimp.RESIZE_NEAREST_NEIGHBOR);
    const data = new ImageData(
        new Uint8ClampedArray(processed.bitmap.data),
        w, h);
    const bitmap = await createImageBitmap(data);
    ctx.drawImage(bitmap, 0, 0);
}

async function load(url: string): Promise<void> {
    originalImage = await Jimp.read(url);
    display();
}

ui.input.select({
    label: 'Bild',
    optionValues: [...images.values()],
    optionTexts: [...images.keys()],
    handler: (selection) => load(selection.value),
    handleOnInit: true
});

const algorithmSelect = ui.input.select({
    label: 'Algorithmus',
    optionValues: Algorithms,
    handler: display
});

const pixelSizeInput = ui.input.number({
    label: 'Pixelgröße',
    value: 4,
    handler: display
});
