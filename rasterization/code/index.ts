import { TextInput, UI } from '@lukaswagner/web-ui';
import { addFullscreenCheckbox, setupFullscreen } from 'helper/fullscreen';

import { Canvas } from 'webgl-operate';
import { RasterizationRenderer } from './rasterization';
import { expose } from 'helper/expose';

const container =
    document.getElementById('content-container') as HTMLDivElement;
const htmlCanvas =
    document.getElementById('content') as HTMLCanvasElement;

setupFullscreen(container, htmlCanvas);

const options: WebGLContextAttributes = {};
const canvas = new Canvas(htmlCanvas, options);
const renderer = new RasterizationRenderer();
canvas.renderer = renderer;

expose(canvas);

const controls = document.getElementById('controls') as HTMLDivElement;
const ui = new UI(controls, true);

addFullscreenCheckbox(container, ui);

ui.input.select({
    label: 'Implementierung',
    optionValues: renderer.modes,
    handler: (v) => renderer.mode = v.index
});

const colors: TextInput[] = [];
colors.push(ui.input.text({
    label: 'Vertexfarbe 1',
    type: 'color',
    handler: (v) => renderer.setVertexColor(0, v)
}));

colors.push(ui.input.text({
    label: 'Vertexfarbe 2',
    type: 'color',
    handler: (v) => renderer.setVertexColor(1, v)
}));

colors.push(ui.input.text({
    label: 'Vertexfarbe 3',
    type: 'color',
    handler: (v) => renderer.setVertexColor(2, v)
}));

const palettes = [
    { name: 'RGB', colors: ['#ff0000', '#00ff00', '#0000ff'] },
    { name: 'HPI', colors: ['#b1063a', '#dd6108', '#f6a800'] }
];

ui.input.select({
    label: 'Farbpalette',
    optionValues: palettes.map((p) => p.name),
    handler: (v) => palettes[v.index].colors.forEach(
        (c, i) => {
            colors[i].value = c;
            colors[i].invokeHandler();
        })
});

// vertex moving
let moveIndex = -1;
const numberOfPoints = 3;
const selectRadius = 100;

// initialize point list: 2 floats per point (x, y)
const vertices = new Float32Array(2 * numberOfPoints);
// generate the points clockwise around the middle of the canvas
for (let i = 0; i < numberOfPoints; i++) {
    const angle = (Math.PI * 2 / numberOfPoints) * -i;
    const dist = Math.random() / 2;
    const x = Math.cos(angle) * dist;
    const y = Math.sin(angle) * dist;
    vertices[i * 2 + 0] = 0.5 + x;
    vertices[i * 2 + 1] = 0.5 + y;
    // vertex based implementations uses
    // coordinates in the range [-1, 1]^2
    renderer.setVertexPositions(vertices);
}

// check if mouse down happened close to a vertex
htmlCanvas.addEventListener('mousedown', (event) => {
    // distance to the closest vertex yet
    let minDist = Number.MAX_VALUE;
    // check all the vertices
    for (let i = 0; i < numberOfPoints; i++) {
        // convert vertex coordinates to canvas coordinates
        const pointX = vertices[i * 2 + 0] * htmlCanvas.clientWidth;
        const pointY = vertices[i * 2 + 1] * htmlCanvas.clientHeight;
        // get click position on canvas
        const posX = event.offsetX;
        const posY = htmlCanvas.clientHeight - event.offsetY;
        // calculate the distance
        const diffX = pointX - posX;
        const diffY = pointY - posY;
        const dist = Math.sqrt(diffX * diffX + diffY * diffY);
        // select closest vertex within the select radius
        if (dist < selectRadius && dist < minDist) {
            moveIndex = i;
            minDist = dist;
        }
    }
});

// move vertex if one is selected
htmlCanvas.addEventListener('mousemove', (event) => {
    if (moveIndex >= 0) {
        vertices[moveIndex * 2 + 0] =
            event.offsetX / htmlCanvas.clientWidth;
        vertices[moveIndex * 2 + 1] =
            1 - (event.offsetY / htmlCanvas.clientHeight);
        // vertex based implementations uses
        // coordinates in the range [-1, 1]^2
        renderer.setVertexPositions(vertices);
    }
});

// deselect if mouse button is released
htmlCanvas.addEventListener('mouseup', () => {
    moveIndex = -1;
});
