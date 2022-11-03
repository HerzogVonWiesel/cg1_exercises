import {
    ChangeLookup,
    DefaultFramebuffer,
    NdcFillingTriangle,
    Program,
    Renderer,
    Shader
} from 'webgl-operate';


export class MetaballRenderer extends Renderer {
    protected static modes = [
        'Weiße Metaballs',

        // implement this to get 2 bonus points
        'Psychedelisch',
        // you can add more visualizations :)
        'Zebra'
    ];

    protected static numberOfMetaballs = 10;
    protected static maxSpeed = 0.3;
    protected static updateRate = 120;

    protected _altered = Object.assign(new ChangeLookup(), {
        any: false,
        multiFrameNumber: false,
        frameSize: false,
        canvasSize: false,
        framePrecision: false,
        clearColor: false,
        debugTexture: false,
        metaballs: false,
        radiusFactor: false,
        mode: false
    });

    protected _gl: WebGL2RenderingContext;
    protected _fbo: DefaultFramebuffer;
    protected _geom: NdcFillingTriangle;
    protected _program: Program;

    protected _radiusFactor: number;
    protected _metaballs: Float32Array;
    protected _metaballDirections: number[][] = [];
    protected _mode: number;

    protected _uRadiusFactor: WebGLUniformLocation;
    protected _uResolution: WebGLUniformLocation;
    protected _uMetaballs: WebGLUniformLocation;
    protected _uMode: WebGLUniformLocation;

    protected onInitialize(): boolean {
        this._gl = this._context.gl as WebGL2RenderingContext;

        let valid = true;

        this._fbo = new DefaultFramebuffer(this._context);
        valid &&= this._fbo.initialize();
        this._fbo.clearColor([0.3, 0.3, 0.3, 1.0]);
        this._geom = new NdcFillingTriangle(this._context);
        valid &&= this._geom.initialize(0);

        const vert = new Shader(this._context, this._gl.VERTEX_SHADER);
        valid &&= vert.initialize(require('./quad.vert'));
        const frag = new Shader(this._context, this._gl.FRAGMENT_SHADER);
        frag.replace(
            '$NUMBER_OF_METABALLS',
            MetaballRenderer.numberOfMetaballs.toString());
        valid &&= frag.initialize(require('./metaballs.frag'));
        this._program = new Program(this._context);
        valid &&= this._program.initialize([vert, frag]);

        this._uRadiusFactor = this._program.uniform('u_radiusFactor');
        this._uResolution = this._program.uniform('u_resolution');
        this._uMetaballs = this._program.uniform('u_metaballs');
        this._uMode = this._program.uniform('u_mode');

        this._metaballs = new Float32Array(
            3 * MetaballRenderer.numberOfMetaballs);
        for (let i = 0; i < MetaballRenderer.numberOfMetaballs; i++) {
            this._metaballs[i * 3 + 0] = Math.random();
            this._metaballs[i * 3 + 1] = Math.random();
            // set radius relative to canvas width
            // 0.1 means the radius is 1/10 of the canvas width
            // aka the diameter is 1/5 of the canvas width
            // you can experiment here
            this._metaballs[i * 3 + 2] = 0.05;
            // set random movement directions
            this._metaballDirections[i] = [
                Math.random() *
                MetaballRenderer.maxSpeed / MetaballRenderer.updateRate,
                Math.random() *
                MetaballRenderer.maxSpeed / MetaballRenderer.updateRate];
        }

        setInterval(
            this.updateAnimation.bind(this),
            1000 / MetaballRenderer.updateRate);

        return valid;
    }

    protected updateDirection(index: number, direction: number): void {
        const oldValue = this._metaballs[index * 3 + direction];
        let newValue = oldValue + this._metaballDirections[index][direction];
        // reflect if new position is bigger then 1.0
        if (newValue >= 1) {
            newValue = 2 - newValue;
            this._metaballDirections[index][direction] *= -1;
        // reflect if new position is smaller then 0.0
        } else if (newValue <= 0) {
            newValue = -newValue;
            this._metaballDirections[index][direction] *= -1;
        }
        this._metaballs[index * 3 + direction] = newValue;
    }

    protected updateAnimation(): void {
        for (let i = 0; i < MetaballRenderer.numberOfMetaballs; i++) {
            this.updateDirection(i, 0);
            this.updateDirection(i, 1);
        }
        this.invalidate(true);
    }

    protected onUninitialize(): void {
    }

    protected onDiscarded(): void {
    }

    protected onUpdate(): boolean {
        return this._altered.any;
    }

    protected onPrepare(): void {
        if (this._altered.radiusFactor) {
            this._program.bind();
            this._gl.uniform1f(this._uRadiusFactor, this._radiusFactor);
            this._program.unbind();
        }

        if (this._altered.mode) {
            this._program.bind();
            this._gl.uniform1i(this._uMode, this._mode);
            this._program.unbind();
        }

        this._altered.reset();
    }

    protected onFrame(): void {
        this._gl.viewport(0, 0, this._frameSize[0], this._frameSize[1]);
        this._fbo.clear(this._gl.COLOR_BUFFER_BIT, true, false);

        this._program.bind();
        this._gl.uniform2f(
            this._uResolution,
            this._canvasSize[0],
            this._canvasSize[1]);
        this._gl.uniform3fv(this._uMetaballs, this._metaballs);

        this._geom.bind();
        this._geom.draw();
        this._geom.unbind();

        this._program.unbind();
        this._fbo.unbind();
    }

    public get modes(): string[] {
        return MetaballRenderer.modes.slice();
    }

    public set mode(mode: number) {
        this._mode = mode;
        this._altered.alter('mode');
        this.invalidate();
    }

    public set radiusFactor(factor: number) {
        this._radiusFactor = factor;
        this._altered.alter('radiusFactor');
        this.invalidate();
    }
}
