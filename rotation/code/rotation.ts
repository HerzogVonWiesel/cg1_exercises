import { Angles, StartEndAngles } from './angles';

import {
    Camera,
    ChangeLookup,
    DefaultFramebuffer,
    GLTFLoader,
    Renderer,
    mat4,
    vec3,
} from 'webgl-operate';

import { ModelPass } from './modelPass';
import { interpolateEuler } from './interpolateEuler';
import { interpolateMatrix } from './interpolateMatrix';
import { interpolateQuaternion } from './interpolateQuaternion';
import { preCalc } from './preCalc';

type Model = {
    uri: string,
    scale: number,
}

type Mode = {
    name: string;
    f: (startRotation: Angles, endRotation: Angles, t: number) => mat4;
};

type Preset = {
    name: string,
    angles: StartEndAngles
}

export class RotationRenderer extends Renderer {
    protected readonly _altered = Object.assign(new ChangeLookup(), {
        any: false,
        multiFrameNumber: false,
        frameSize: false,
        canvasSize: false,
        framePrecision: false,
        clearColor: false,
        debugTexture: false,
        model: false,
        mode: false,
        angles: false,
        interpolateFactor: false
    });

    protected _gl: WebGL2RenderingContext;

    protected _fbo: DefaultFramebuffer;
    protected _camera: Camera;
    protected _modelPass: ModelPass;

    protected _model: Model;

    protected _modes = [
        {
            name: 'Matrix',
            f: interpolateMatrix,
        },
        {
            name: 'Eulerwinkel',
            f: interpolateEuler,
        },
        {
            name: 'Quaternionen',
            f: interpolateQuaternion,
        },
    ];
    protected _mode: Mode;

    protected _preset: Preset;
    protected _interpolateFactor = 0;

    // precalculated rotation matrices for presets
    protected _precalculated = JSON.parse(require('./precalculated.json'));

    /**
     * Helper function for precalculating rotation matrices for all presets
     * and modes.
     * @param resolution - Number of intermediate rotation matrixes to calculate
     * @param maxPrecision - Max amount for number of digits in output
     * @param presets - Preset to precalculate rotation matrices for
     * @returns The precalculated rotation matrices as string
     */
    public preCalc(
        resolution: number, maxPrecision: number, preset: Preset
    ): string {
        const result = [];
        result.push(`"${preset.name}":{`);
        // iterate over all modes
        this._modes.forEach((m, mi) => {
            // precalculate and store matrices
            result.push(`"${m.name}":[`);
            result.push(
                preCalc(preset.angles, m.f, resolution, maxPrecision));
            result.push(mi < this._modes.length - 1 ? '],' : ']');
        });
        result.push('}');
        return result.join('');
    }

    /**
     * Initializes and sets up rendering passes, loads a font face
     * and links shaders with program.
     * @param context - valid context to create the object for.
     * @param identifier - meaningful name for identification of this instance.
     * @returns - whether initialization was successful
     */
    protected onInitialize(): boolean {
        this._gl = this._context.gl;

        this._fbo = new DefaultFramebuffer(this._context, 'DefaultFBO');
        this._fbo.initialize();

        // Create and configure camera.
        this._camera = new Camera();
        this._camera.center = vec3.fromValues(0.0, 0.0, 0.0);
        this._camera.up = vec3.fromValues(0.0, 1.0, 0.0);
        this._camera.eye = vec3.fromValues(0.0, 0.0, 100.0);
        this._camera.far = 101.0;
        this._camera.near = 99.0;
        this._camera.fovy = 1.7;

        // Create and configure render pass.
        this._modelPass = new ModelPass(this._context);
        this._modelPass.initialize();
        this._modelPass.camera = this._camera;
        this._modelPass.target = this._fbo;

        return true;
    }

    protected onUninitialize(): void {
        super.uninitialize();

        this._fbo.uninitialize();
        this._modelPass.uninitialize();
    }

    protected onUpdate(): boolean {
        return this._altered.any || this._camera.altered;
    }

    protected onPrepare(): void {
        if (this._altered.frameSize) {
            this._camera.viewport = [this._frameSize[0], this._frameSize[1]];
        }

        if (this._altered.canvasSize) {
            this._camera.aspect = this._canvasSize[0] / this._canvasSize[1];
        }

        if (this._altered.clearColor) {
            this._modelPass.clearColor = this._clearColor;
        }

        if (this._altered.angles ||
            this._altered.interpolateFactor ||
            this._altered.mode
        ) {
            this._modelPass.calculated = this._mode.f(
                this._preset.angles.start,
                this._preset.angles.end,
                this._interpolateFactor
            );

            const precalculated = this._precalculated[this._preset.name];
            if (precalculated) {
                const v = precalculated[this._mode.name];
                const i = Math.floor((v.length - 1) * this._interpolateFactor);
                this._modelPass.comparison = mat4.copy(mat4.create(), v[i]);
            } else {
                this._modelPass.comparison = undefined;
            }
        }

        if (this._altered.interpolateFactor) {
            this._modelPass.interpolateFactor = this._interpolateFactor;
        }

        this._modelPass.update();
        this._modelPass.prepare();

        this._altered.reset();
        this._camera.altered = false;
    }

    protected onFrame(): void {
        this._modelPass.frame();
    }

    protected onSwap(): void {
    }

    /**
     * Load asset from URI specified by the HTML select
     */
    public loadAsset(model: Model): void {
        this._model = model;
        const loader = new GLTFLoader(this._context);
        loader.loadAsset(model.uri)
            .then(() => {
                this._modelPass.scene = loader.defaultScene;
                this._modelPass.scale = model.scale;
                this._altered.alter('model');
                this.invalidate();
            });
    }

    protected onDiscarded(): void {
    }

    public get modes(): string[] {
        return this._modes.map((m) => m.name);
    }

    public set mode(v: string) {
        this._mode = this._modes.find((m) => m.name === v);
        this._altered.alter('mode');
        this.invalidate();
    }

    public set interpolateFactor(v: number) {
        this._interpolateFactor = v;
        this._altered.alter('interpolateFactor');
        this.invalidate();
    }

    public set preset(v: Preset) {
        this._preset = v;
        this._altered.alter('angles');
        this.invalidate();
    }
}
