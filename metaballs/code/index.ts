import {
    addFullscreenCheckbox,
    setupFullscreen
} from 'helper/fullscreen';

import { Canvas } from 'webgl-operate';
import { MetaballRenderer } from './renderer';
import { UI } from '@lukaswagner/web-ui';
import { expose } from 'helper/expose';

const container =
    document.getElementById('content-container') as HTMLDivElement;
const htmlCanvas =
    document.getElementById('content') as HTMLCanvasElement;

setupFullscreen(container, htmlCanvas);

const options: WebGLContextAttributes = {};
const canvas = new Canvas(htmlCanvas, options);
const renderer = new MetaballRenderer();
canvas.renderer = renderer;

expose(canvas);

const controls = document.getElementById('controls') as HTMLDivElement;
const ui = new UI(controls, true);

addFullscreenCheckbox(container, ui);

ui.input.select({
    label: 'Modus',
    optionValues: [...renderer.modes],
    handler: (selection) => renderer.mode = selection.index
});

ui.input.numberRange({
    label: 'Radiusfaktor',
    value: 1,
    min: 0,
    max: 2,
    step: 0.001,
    triggerHandlerOnMove: true,
    handler: (value) => renderer.radiusFactor = value
});
