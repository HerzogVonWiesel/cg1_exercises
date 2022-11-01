import {
    addFullscreenCheckbox,
    setupFullscreen
} from 'helper/fullscreen';

import { Canvas } from 'webgl-operate';
import { CpuGpuRenderer } from './renderer';
import { UI } from '@lukaswagner/web-ui';
import { expose } from 'helper/expose';
import images from '../../data/images';

const container =
    document.getElementById('content-container') as HTMLDivElement;
const htmlCanvas =
    document.getElementById('content') as HTMLCanvasElement;

setupFullscreen(container, htmlCanvas);

const options: WebGLContextAttributes = {};
const canvas = new Canvas(htmlCanvas, options);
const renderer = new CpuGpuRenderer();
canvas.renderer = renderer;

expose(canvas);

const controls = document.getElementById('controls') as HTMLDivElement;
const ui = new UI(controls, true);

addFullscreenCheckbox(container, ui);

ui.input.select({
    label: 'Bild',
    optionValues: [...images.values()],
    optionTexts: [...images.keys()],
    handler: (selection) => renderer.image = selection.value
});

ui.input.select({
    label: 'Algorithmus',
    optionValues: [...renderer.algorithms],
    handler: (selection) => renderer.algorithm = selection.value
});

ui.input.numberRange({
    label: 'Unschärferadius',
    value: 4,
    min: 1,
    max: 10,
    step: 1,
    triggerHandlerOnMove: true,
    handler: (value) => renderer.blurRadius = value
});
