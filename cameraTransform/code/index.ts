import { Canvas, vec3 } from 'webgl-operate';
import { addFullscreenCheckbox, setupFullscreen } from 'helper/fullscreen';
import { CameraTransformRenderer } from './renderer';
import { UI } from '@lukaswagner/web-ui';
import { expose } from 'helper/expose';

const container =
    document.getElementById('content-container') as HTMLDivElement;
const htmlCanvas =
    document.getElementById('content') as HTMLCanvasElement;

setupFullscreen(container, htmlCanvas);

const options: WebGLContextAttributes = {};
const canvas = new Canvas(htmlCanvas, options);
const renderer = new CameraTransformRenderer();
canvas.renderer = renderer;

expose(canvas);

const controls = document.getElementById('controls') as HTMLDivElement;
const ui = new UI(controls, true);

addFullscreenCheckbox(container, ui);

const modes = [
    'Original',
    'LookAt',
    'Winkeländerung des Sichtvolumens',
    'Skalierung des Sichtvolumens',
    'Perspektivische Transformation',
    'Clipping'
];

ui.input.select({
    label: 'Anzeigemodus',
    optionValues: modes,
    handler: (value) => renderer.mode = value.index
});
