import {
    Buffer,
    Context,
    Geometry,
    Initializable
} from 'webgl-operate';

export class TriangleFanGeometry extends Geometry {
    protected _gl: WebGL2RenderingContext;

    protected _vertices: Float32Array;
    protected _aVertex: GLuint;

    protected _aInstanceAttrA: GLuint;
    protected _aInstanceAttrB: GLuint;
    protected _numInstances = 1;

    public constructor(context: Context) {
        super(context);
        this._gl = this.context.gl as WebGL2RenderingContext;

        this._buffers.push(new Buffer(context));
    }

    protected bindBuffers(): void {
        this._buffers[0].attribEnable(
            this._aVertex, 2, this._gl.FLOAT,
            false, 0, 0, true, false);
        this._gl.vertexAttribDivisor(this._aVertex, 0);
    }

    protected unbindBuffers(): void {
        this._buffers[0].attribDisable(this._aVertex, false);
    }

    protected uploadBuffers(): void {
        this._buffers[0].data(this._vertices, this._gl.STATIC_DRAW);
    }

    @Initializable.initialize()
    public initialize(aVertex: GLuint = 0): boolean {
        this._aVertex = aVertex;

        const valid = super.initialize([this._gl.ARRAY_BUFFER]);

        this._vertices = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0]);
        this.uploadBuffers();

        return valid;
    }

    public degToRad(degrees: number): number {
        return degrees * Math.PI / 180;
    }

    public rotateVec(vector: number[], angle: number): number[]{
        const x = Math.cos(angle)*vector[0]-Math.sin(angle)*vector[1];
        const y = Math.sin(angle)*vector[0]+Math.cos(angle)*vector[1];
        return [x, y];
    }

    public build(numOuterPoints: number, radius: number): void {
        const vertices = new Float32Array(2*numOuterPoints+4);
        // placeholder builds a triangle like this:
        //    2
        //   / \
        //  /   \
        // 0 --- 1

        // TODO: generate vertices to draw regular polygon using a triangle fan
        const alpha = 360.0/numOuterPoints;
        let h = [radius, radius*Math.tan(this.degToRad(alpha*0.5))];

        vertices[0] = 0.0;
        vertices[1] = 0.0;

        for (let i = 1; i<=numOuterPoints+1; i++){
            vertices[2*i] = h[0];
            vertices[2*i+1] = h[1];
            h = this.rotateVec(h, this.degToRad(alpha));
        }

        this._vertices = vertices;
        this.uploadBuffers();
    }

    public draw(): void {
        this._gl.drawArraysInstanced(
            this._gl.TRIANGLE_FAN,
            0,
            this._vertices.length / 2,
            this._numInstances);
    }

    public get aVertex(): GLuint {
        return this._aVertex;
    }

    public set numInstances(num: number) {
        this._numInstances = num;
    }
}
