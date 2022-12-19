import './style.css';

import {
    addFullscreenCheckbox,
    setupFullscreen
} from 'helper/fullscreen';

import { Canvas } from 'webgl-operate';
import { UI } from '@lukaswagner/web-ui';
import { ViewFinderRenderer } from './viewFinder';
import { expose } from 'helper/expose';

const container =
    document.getElementById('content-container') as HTMLDivElement;
const htmlCanvas =
    document.getElementById('content') as HTMLCanvasElement;

setupFullscreen(container, htmlCanvas);

const options: WebGLContextAttributes = {};
const canvas = new Canvas(htmlCanvas, options);
const renderer = new ViewFinderRenderer();
canvas.renderer = renderer;

expose(canvas);

const controls = document.getElementById('controls') as HTMLDivElement;
const ui = new UI(controls, true);

addFullscreenCheckbox(container, ui);

const images = new Map([
    ['Sanssouci 1', require('../img/sanssouci-potsdam-park-sanssouci.png')],
    ['Sanssouci 2', require('../img/architektur-garten-terrasse-schloss.png')]
]);

ui.input.select({
    label: 'Bild',
    optionTexts: [...images.keys()],
    optionValues: [...images.values()],
    handler: (selection) => renderer.image = selection.value
});

ui.input.button({
    text: 'Kamera zurücksetzen',
    handler: () => renderer.resetCamera(),
    handleOnInit: true
});

ui.input.numberRange({
    label: 'Auflösung der Geometrie',
    value: 20, min: 1, max: 50, step: 1,
    handler: (value) => renderer.resolution = value
});
