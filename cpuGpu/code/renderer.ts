import {
    ChangeLookup,
    DefaultFramebuffer,
    NdcFillingTriangle,
    Program,
    Renderer,
    Shader,
    Texture2D
} from 'webgl-operate';

import Jimp from 'jimp';
import { blur } from './blur';
import { laplace } from './laplace';
import { original } from './original';
import { sharpen } from './sharpen';

type Algorithm = {
    name: string,
    cpu: (
        input: Uint8Array,
        output: Uint8Array,
        w: number,
        h: number,
        params?: unknown
    ) => void,
    gpu: Program
}

export class CpuGpuRenderer extends Renderer {
    protected _altered = Object.assign(new ChangeLookup(), {
        any: false,
        multiFrameNumber: false,
        frameSize: false,
        canvasSize: false,
        framePrecision: false,
        clearColor: false,
        debugTexture: false,
        originalImage: false,
        resizedImage: false,
        cpuImage: false,
        algorithm: false,
        blurRadius: false
    });

    protected _gl: WebGL2RenderingContext;
    protected _fbo: DefaultFramebuffer;
    protected _geom: NdcFillingTriangle;
    protected _algorithms: Algorithm[];
    protected _algorithm: Algorithm;

    protected _originalImage: Jimp;
    protected _resizedImage: Jimp;
    protected _cpuImage: Uint8Array;
    protected _image: Texture2D;
    protected _blurRadius: number;

    protected setupProgram(
        fragmentShader: string
    ): { valid: boolean, program: Program } {
        let valid = true;

        const vert = new Shader(this._context, this._gl.VERTEX_SHADER);
        valid &&= vert.initialize(require('./quad.vert'));
        const frag = new Shader(this._context, this._gl.FRAGMENT_SHADER);
        valid &&= frag.initialize(fragmentShader);
        const program = new Program(this._context);
        valid &&= program.initialize([vert, frag]);

        program.bind();
        this._gl.uniform1i(program.uniform('u_texture'), 0);
        program.unbind();

        return {valid, program};
    }

    protected onInitialize(): boolean {
        this._gl = this._context.gl as WebGL2RenderingContext;

        let valid = true;

        this._fbo = new DefaultFramebuffer(this._context);
        valid &&= this._fbo.initialize();
        this._fbo.clearColor([0.3, 0.3, 0.3, 1.0]);
        this._geom = new NdcFillingTriangle(this._context);
        valid &&= this._geom.initialize(0);

        this._algorithms = [];

        const originalShader = this.setupProgram(require('./img.frag'));
        valid &&= originalShader.valid;
        this._algorithms.push({
            name: 'Original',
            cpu: original,
            gpu: originalShader.program
        });

        const sharpenShader = this.setupProgram(require('./sharpen.frag'));
        valid &&= sharpenShader.valid;
        this._algorithms.push({
            name: 'Sharpen - CPU',
            cpu: sharpen,
            gpu: originalShader.program
        });
        this._algorithms.push({
            name: 'Sharpen - GPU',
            cpu: original,
            gpu: sharpenShader.program
        });

        const blurShader = this.setupProgram(require('./blur.frag'));
        valid &&= blurShader.valid;
        this._algorithms.push({
            name: 'Blur - CPU',
            cpu: blur,
            gpu: originalShader.program
        });
        this._algorithms.push({
            name: 'Blur - GPU',
            cpu: original,
            gpu: blurShader.program
        });

        const laplaceShader = this.setupProgram(require('./laplace.frag'));
        valid &&= laplaceShader.valid;
        this._algorithms.push({
            name: 'Laplace - CPU',
            cpu: laplace,
            gpu: originalShader.program
        });
        this._algorithms.push({
            name: 'Laplace - GPU',
            cpu: original,
            gpu: laplaceShader.program
        });

        this._image = new Texture2D(this._context);
        valid &&= this._image.initialize(
            1, 1,
            this._gl.RGB8, this._gl.RGB, this._gl.UNSIGNED_BYTE);
        this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, true);
        this._gl.pixelStorei(this._context.gl.UNPACK_ALIGNMENT, 1);

        return valid;
    }

    protected onUninitialize(): void {
    }

    protected onDiscarded(): void {
    }

    protected onUpdate(): boolean {
        return this._altered.any;
    }

    protected onPrepare(): void {
        const resChanged =
            this._canvasSize[0] !== this._resizedImage?.getWidth() ||
        this._canvasSize[1] !== this._resizedImage?.getHeight();
        if (!!this._originalImage &&
            (this._altered.originalImage || (!this._resizedImage || resChanged))
        ) {
            this._resizedImage = new Jimp(this._originalImage);
            this._resizedImage.cover(this._canvasSize[0], this._canvasSize[1]);
            this._altered.alter('resizedImage');
        }

        if (!!this._resizedImage &&
            ((this._altered.resizedImage || this._altered.algorithm) ||
            (this._algorithm.name === 'Blur - CPU') && this._altered.blurRadius)
        ) {
            const withoutAlpha =
                this._resizedImage.bitmap.data.filter((v, i) => i % 4 !== 3);
            this._cpuImage = new Uint8Array(withoutAlpha.length);
            this._algorithm.cpu(
                withoutAlpha,
                this._cpuImage,
                this._resizedImage.getWidth(),
                this._resizedImage.getHeight(),
                { blurRadius: this._blurRadius });
            this._altered.alter('cpuImage');
        }

        if (!!this._cpuImage && this._altered.cpuImage) {
            this._image.resize(
                this._resizedImage.getWidth(),
                this._resizedImage.getHeight());
            this._image.data(this._cpuImage);
        }

        this._altered.reset();
    }

    protected onFrame(): void {
        if (!this._cpuImage) return;

        this._gl.viewport(0, 0, this._frameSize[0], this._frameSize[1]);
        this._fbo.clear(this._gl.COLOR_BUFFER_BIT, true, false);

        this._algorithm.gpu.bind();
        const resolutionUniform = this._algorithm.gpu.uniform('u_resolution');
        if (resolutionUniform !== undefined) {
            this._gl.uniform2f(
                resolutionUniform,
                this._resizedImage.getWidth(),
                this._resizedImage.getHeight());
        }
        const radiusUniform = this._algorithm.gpu.uniform('u_radius');
        if (radiusUniform !== undefined) {
            this._gl.uniform1f(radiusUniform, this._blurRadius);
        }

        this._image.bind(this._gl.TEXTURE0);

        this._geom.bind();
        this._geom.draw();
        this._geom.unbind();

        this._image.unbind(this._gl.TEXTURE0);
        this._algorithm.gpu.unbind();
        this._fbo.unbind();
    }

    protected async load(url: string): Promise<void> {
        this._originalImage = await Jimp.read(url);
        this._altered.alter('originalImage');
        this.invalidate();
    }

    public set image(img: string) {
        this.load(img);
    }

    public get algorithms(): string[] {
        return this._algorithms.map((a) => a.name);
    }

    public set algorithm(alg: string) {
        const newAlg = this._algorithms.find((a) => a.name === alg);
        this._algorithm = newAlg ?? this._algorithm;
        this._altered.alter('algorithm');
        this.invalidate();
    }

    public set blurRadius(rad: number) {
        this._blurRadius = rad;
        this._altered.alter('blurRadius');
        this.invalidate();
    }
}
