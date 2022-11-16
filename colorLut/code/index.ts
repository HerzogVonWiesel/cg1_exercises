import './style.css';

import {
    addFullscreenCheckbox,
    setupFullscreen
} from 'helper/fullscreen';

import { Canvas } from 'webgl-operate';
import { LutRenderer } from './lu';
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
const renderer = new LutRenderer();
canvas.renderer = renderer;

expose(canvas);

const controls = document.getElementById('controls') as HTMLDivElement;
const ui = new UI(controls, true);

addFullscreenCheckbox(container, ui);

ui.input.select({
    label: 'Auflösung der LUT',
    optionValues: [...new Array(6)].map((_, i) => String(Math.pow(2, i + 2))),
    handler: (v) => renderer.resolution = Number(v.value)
});

ui.input.button({
    text: 'Identitäts-LUT anzeigen',
    handler: () => renderer.showIdentity()
});

ui.input.button({
    text: 'Identitäts-LUT exportieren',
    handler: () => renderer.exportIdentity()
});

ui.input.button({
    text: 'Identitäts-LUT anwenden',
    handler: () => renderer.applyIdentity()
});

ui.input.select({
    label: 'Eingabebild',
    optionValues: [...images.values()],
    optionTexts: [...images.keys()],
    handler: (selection) => renderer.image = selection.value
});

const imgInput = ui.input.file({
    label: 'Eingabebild hochladen',
    text: 'Datei  wählen',
    handler: (files) => {
        if (files[0]) renderer.image = files[0];
    }
});
imgInput.elements[0].accept = 'image/png, image/jpeg';

const lutInput = ui.input.file({
    label: 'LUT importieren',
    text: 'Datei  wählen',
    handler: (files) => {
        if (files[0]) renderer.lut = files[0];
    }
});
lutInput.elements[0].accept = 'image/png';

// set initial mode
renderer.showIdentity();
