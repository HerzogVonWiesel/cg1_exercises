import './style.css';

import { Angle, RollPitchYaw, StartEnd } from './angles';
import { NumberRangeInput, UI } from '@lukaswagner/web-ui';
import { addFullscreenCheckbox, setupFullscreen } from 'helper/fullscreen';

import { Canvas } from 'webgl-operate';
import { RotationRenderer } from './rotation';
import { expose } from 'helper/expose';
import { glb } from '../../data/models';
const modelScales = JSON.parse(require('./models.json'));
const presets = JSON.parse(require('./presets.json'));

const container =
    document.getElementById('content-container') as HTMLDivElement;
const htmlCanvas =
    document.getElementById('content') as HTMLCanvasElement;

setupFullscreen(container, htmlCanvas);

const options: WebGLContextAttributes = {};
const canvas = new Canvas(htmlCanvas, options);
const renderer = new RotationRenderer();
canvas.renderer = renderer;

expose(canvas);

const controls = document.getElementById('controls') as HTMLDivElement;
const ui = new UI(controls, true);

addFullscreenCheckbox(container, ui);

const models = new Map(Object.keys(modelScales).map((k) => {
    return [k, Object.assign({
        uri: glb.get(k)
    }, modelScales[k])];
}));

ui.input.select({
    label: 'Modell',
    optionTexts: [...models.keys()],
    handler: (selection) => renderer.loadAsset(models.get(selection.value))
});

ui.input.select({
    label: 'Modus',
    optionTexts: renderer.modes,
    handler: (selection) => renderer.mode = selection.value
});

const factor = ui.input.numberRange({
    label: 'Interpolationsfaktor',
    min: 0,
    max: 1,
    step: 0.005,
    value: 0,
    handler: (value) => renderer.interpolateFactor = value,
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

const angles: { input: NumberRangeInput, angle: Angle }[] = [];

const preset = ui.input.select({
    label: 'Voreinstellung',
    optionTexts: Object.keys(presets),
    handler: (selection) => {
        const p = presets[selection.value];
        angles.forEach((s) =>
            s.input.value = p[s.angle.se][s.angle.rpy].toString());
        renderer.preset = { name: selection.value, angles: p };
    },
    handleOnInit: false
});

const halfNumSteps = 50;
const custom = 'Benutzerdefiniert';
const slider = (
    label: string,
    piRange: number,
    se: StartEnd,
    rpy: RollPitchYaw
): void => {
    const halfRange = piRange * Math.PI;
    const halfStep = halfRange / (halfNumSteps + 1);
    const input = ui.input.numberRange({
        label,
        min: -halfRange,
        max: halfRange,
        step: halfStep,
        value: 0,
        handler: (value) => {
            if (preset.value !== custom) {
                Object.apply(
                    presets[custom],
                    presets[preset.value]);
            }
            presets[custom][se][rpy] = value;
            preset.value = custom;
            renderer.preset = { name: custom, angles: presets[custom] };
        },
        triggerHandlerOnMove: true
    });
    presets[custom][se][rpy] = input.value;
    angles.push({ input, angle: { se, rpy } });
};
slider('Startrollwinkel', 1, StartEnd.Start, RollPitchYaw.Roll);
slider('Startnickwinkel', 1, StartEnd.Start, RollPitchYaw.Pitch);
slider('Startgierwinkel', 1, StartEnd.Start, RollPitchYaw.Yaw);
slider('Endrollwinkel', 1, StartEnd.End, RollPitchYaw.Roll);
slider('Endnickwinkel', 1, StartEnd.End, RollPitchYaw.Pitch);
slider('Endgierwinkel', 1, StartEnd.End, RollPitchYaw.Yaw);

preset.value = 'Kombiniert';
preset.invokeHandler();

const enablePrecalc = false;
if (enablePrecalc) ui.input.button({
    text: 'Precalculate',
    handler: () => {
        const result: string[] = [];
        result.push('{');
        Object.keys(presets)
            .filter((p) => p !== 'Benutzerdefiniert')
            .forEach((p, pi, a) => {
                result.push(renderer.preCalc(
                    50, 3, { name: p, angles: presets[p] }));
                if (pi < a.length - 1) result.push(',');
            });
        result.push('}');
        console.log(result.join(''));
    }
});

ui.input.button({
    text: 'Zurücksetzen',
    handler: () => {
        for (const a of angles) {
            a.input.value = 0;
            a.input.invokeHandler();
        }
    }
});
