import './style.css';

import { addFullscreenCheckbox, setupFullscreen } from 'helper/fullscreen';
import { Canvas } from 'webgl-operate';
import { PerformanceRenderer } from './performanceRenderer';
import { UI } from '@lukaswagner/web-ui';
import { expose } from 'helper/expose';

const container =
    document.getElementById('content-container') as HTMLDivElement;
const htmlCanvas =
    document.getElementById('content') as HTMLCanvasElement;

setupFullscreen(container, htmlCanvas);

const options: WebGLContextAttributes = { antialias: false };
const canvas = new Canvas(htmlCanvas, options);
const renderer = new PerformanceRenderer();
canvas.renderer = renderer;

expose(canvas);

const controls = document.getElementById('controls') as HTMLDivElement;
const ui = new UI(controls, true);

addFullscreenCheckbox(container, ui);

ui.input.numberRange({
    label: 'Anzahl Vertices',
    value: 5,
    min: 3,
    max: 35,
    step: 1,
    handler: (v) => renderer.numVertices = v
});

ui.input.button({
    text: 'Benchmark starten',
    handler: () => renderer.runBenchmark()
});

ui.input.select({
    label: 'Anzeigemodus',
    optionValues: renderer.modes,
    handler: (v) => renderer.mode = v.value
});
