import './style.css';

import { Canvas, vec3 } from 'webgl-operate';
import { addFullscreenCheckbox, setupFullscreen } from 'helper/fullscreen';
import { DollyZoomRenderer } from './dolly';
import { UI } from '@lukaswagner/web-ui';
import { expose } from 'helper/expose';
import { scenes } from '../../data/models';

const viewTargets = new Map<string, vec3>([
    ['Minecraft-Dorf', vec3.fromValues(-2.47382, 2.55654, -4.32813)],
    ['Wasserfall', vec3.fromValues(12.4087, 1.54922, -11.9754)],
    ['Weihnachtsdorf', vec3.fromValues(-1.49249, 1.55078, 3.05065)],
]);

const container =
    document.getElementById('content-container') as HTMLDivElement;
const htmlCanvas =
    document.getElementById('content') as HTMLCanvasElement;

setupFullscreen(container, htmlCanvas);

const options: WebGLContextAttributes = {};
const canvas = new Canvas(htmlCanvas, options);
const renderer = new DollyZoomRenderer();
canvas.renderer = renderer;

expose(canvas);

const controls = document.getElementById('controls') as HTMLDivElement;
const ui = new UI(controls, true);

addFullscreenCheckbox(container, ui);

ui.input.select({
    label: 'Modell',
    optionTexts: [...scenes.keys()],
    handler: (selection) =>
        renderer.loadAsset(scenes.get(selection.value)).then(() =>
            renderer.viewTarget = viewTargets.get(selection.value)),
    handleOnInit: true
});

const factor = ui.input.numberRange({
    label: 'Interpolationsfaktor',
    value: 0, min: 0, max: 1, step: 0.005,
    handler: (v) => renderer.interpolateFactor = v,
    triggerHandlerOnMove: true
});

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

const animInfo = {
    direction: 1,
    handle: undefined as number,
};
const step = (): void => {
    factor.value = clamp(factor.value + animInfo.direction * 0.005, 0, 1);
};
const anim = (): void => {
    const oldPos = factor.value;
    step();
    const newPos = factor.value;
    if (oldPos === newPos) {
        animInfo.direction *= -1;
        step();
    }
    factor.invokeHandler();
};

ui.input.button({
    text: 'Start/Stopp',
    handler: () => {
        if (animInfo.handle) {
            window.clearInterval(animInfo.handle);
            animInfo.handle = undefined;
        } else {
            animInfo.handle = window.setInterval(anim, 1000 / 60);
        }
    }
});

ui.input.numberRange({
    label: 'Größe des Fokusbereichs',
    value: 2, min: 0.5, max: 5, step: 0.05,
    handler: (v) => renderer.focalWidth = v,
    triggerHandlerOnMove: true
});

ui.input.numberRange({
    label: 'Minimalabstand',
    value: 1, min: 0.5, max: 10, step: 0.1,
    handler: (v) => renderer.minDist = v,
    triggerHandlerOnMove: true
});

ui.input.numberRange({
    label: 'Maximalabstand',
    value: 15, min: 10.5, max: 20, step: 0.1,
    handler: (v) => renderer.maxDist = v,
    triggerHandlerOnMove: true
});

ui.input.numberRange({
    label: 'Breitengrad',
    value: 0, min: -180, max: 180, step: 0.5,
    handler: (v) => renderer.latitude = v,
    triggerHandlerOnMove: true
});

ui.input.numberRange({
    label: 'Längengrad',
    value: 0, min: -180, max: 180, step: 0.5,
    handler: (v) => renderer.longitude = v,
    triggerHandlerOnMove: true
});

ui.input.numberRange({
    label: 'Breitengrad (Ende)',
    value: 0, min: -180, max: 180, step: 0.5,
    handler: (v) => renderer.endlatitude = v,
    triggerHandlerOnMove: true
});

ui.input.numberRange({
    label: 'Längengrad (Ende)',
    value: 0, min: -180, max: 180, step: 0.5,
    handler: (v) => renderer.endlongitude = v,
    triggerHandlerOnMove: true
});
