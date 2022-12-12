import './style.css';

import {
    NumberRangeInput,
    UI
} from '@lukaswagner/web-ui';

import {
    addFullscreenCheckbox,
    setupFullscreen
} from 'helper/fullscreen';

import { Canvas } from 'webgl-operate';
import { GlobalDeformationRenderer } from './globalDeformation';
import { expose } from 'helper/expose';
import { glb } from '../../data/models';
const modelsCoords = JSON.parse(require('./models.json'));

const container =
    document.getElementById('content-container') as HTMLDivElement;
const htmlCanvas =
    document.getElementById('content') as HTMLCanvasElement;

setupFullscreen(container, htmlCanvas);

const options: WebGLContextAttributes = {};
const canvas = new Canvas(htmlCanvas, options);
const renderer = new GlobalDeformationRenderer();
canvas.renderer = renderer;

expose(canvas);

const controls = document.getElementById('controls') as HTMLDivElement;
const ui = new UI(controls, true);

addFullscreenCheckbox(container, ui);

const models = new Map(Object.keys(modelsCoords).map((k) => {
    return [k, Object.assign({
        uri: glb.get(k)
    }, modelsCoords[k])];
}));

ui.input.select({
    label: 'Modell',
    optionTexts: [...models.keys()],
    handler: (selection) => renderer.loadAsset(models.get(selection.value)),
    handleOnInit: true
});

const inputs: NumberRangeInput[] = [];

const sharedSettings = { triggerHandlerOnMove: true };
const strengthSettings = Object.assign(
    { min: 0, max: 1, step: 0.01, value: 0 }, sharedSettings);
const angleSettings = Object.assign(
    { min: -180, max: 180, step: 0.1, value: 0 }, sharedSettings);

inputs.push(ui.input.numberRange(Object.assign({
    label: 'Mold-Stärke',
    handler: (value: number) => renderer.moldFactor = value,
}, strengthSettings)));

inputs.push(ui.input.numberRange(Object.assign({
    label: 'Pinch-Stärke',
    handler: (value: number) => renderer.pinchFactor = value,
}, strengthSettings)));

inputs.push(ui.input.numberRange(Object.assign({
    label: 'Twist-Winkel',
    handler: (value: number) => renderer.twistAngle = value / 180 * Math.PI,
}, angleSettings)));

inputs.push(ui.input.numberRange(Object.assign({
    label: 'Bend-Winkel',
    handler: (value: number) => renderer.bendAngle = value / 180 * Math.PI,
}, angleSettings)));

ui.input.button({
    text: 'Zurücksetzen',
    handler: () => inputs.forEach((i) => i.reset(true))
});
