import {
    Color,
    Context,
    DefaultFramebuffer,
    Geometry,
    NdcFillingRectangle,
    Program,
    Renderer,
    Shader
} from 'webgl-operate';

import { TriangleGeometry } from './triangle';

export class RasterizationRenderer extends Renderer {

    // index of the selected program: 0 = fragment based; 1 = vertex based
    protected _selectedProgram = 0;
    protected _programSettings: {
        name: string;
        // shader program
        program: Program;
        // triangle points uniform location
        uPoints: WebGLUniformLocation;
        // triangle points uniform location
        uResolution: WebGLUniformLocation;
        // vertex color uniform location
        uVertexColors: WebGLUniformLocation;
        // geometry to render
        geometry: Geometry;
    }[];

    protected _defaultFBO: DefaultFramebuffer;
    protected _triangle: TriangleGeometry;

    protected _vertexColors = new Float32Array(9);
    protected _vertices = new Float32Array(6);

    /**
     * Helper functions for setting up the various shader programs.
     * @param context - rendering context to create the shaders in
     * @param vertexShader - source code for vertex shader
     * @param fragmentShader - source code for fragment shader
     */
    private setupProgram(
        context: Context, vertexShader: string, fragmentShader: string
    ): Program {
        // store gl object locally for easier access
        const gl = context.gl as WebGLRenderingContext;

        // create shaders from source and initialize
        const vert = new Shader(context, gl.VERTEX_SHADER);
        vert.initialize(vertexShader);
        const frag = new Shader(context, gl.FRAGMENT_SHADER);
        frag.initialize(fragmentShader);

        // create program and initialize it with the prepared shaders
        const program = new Program(context);
        program.initialize([vert, frag], false);

        return program;
    }

    /**
     * Initializes and sets up buffer, geometry, camera and links shaders
     * with program.
     * @param context - valid context to create the object for.
     * @returns - whether initialization was successful
     */
    protected onInitialize(
        context: Context): boolean {

        // set up framebuffer and activate it
        this._defaultFBO = new DefaultFramebuffer(context, 'DefaultFBO');
        this._defaultFBO.initialize();
        this._defaultFBO.bind();

        // initialize the screen filling quad for fragment based rasterization
        const quad = new NdcFillingRectangle(context);
        quad.initialize();

        // initialize the triangle for vertex based rasterization
        this._triangle = new TriangleGeometry(context);
        this._triangle.initialize();

        // prepare shader program for fragment based rasterization
        const fragmentProgram = this.setupProgram(
            context,
            require('./quad.vert'),
            require('./fragmentbasedRasterization.frag'));

        // connect the quad's vertex locations to the shader attribute
        fragmentProgram.attribute('a_vertex', quad.vertexLocation);
        fragmentProgram.link();

        // prepare shader program for vertex based rasterization
        const vertexProgram = this.setupProgram(
            context,
            require('./vertexbasedRasterization.vert'),
            require('./vertexbasedRasterization.frag'));

        // connect the triangle's vertex locations to the shader attribute
        vertexProgram.attribute('a_vertex', this._triangle.vertexLocation);
        // connect the triangle's vertex color locations to the shader attribute
        vertexProgram.attribute('a_color', this._triangle.colorLocation);
        vertexProgram.link();

        this._programSettings = [];
        this._programSettings = [
            {
                name: 'Fragmentshader',
                program: fragmentProgram,
                uResolution: fragmentProgram.uniform('u_resolution'),
                uPoints: fragmentProgram.uniform('u_vertices'),
                uVertexColors: fragmentProgram.uniform('u_colors'),
                geometry: quad,
            },
            {
                name: 'Vertexshader + Fragmentshader',
                program: vertexProgram,
                uResolution: vertexProgram.uniform('u_resolution'),
                uPoints: vertexProgram.uniform('u_vertices'),
                uVertexColors: vertexProgram.uniform('u_colors'),
                geometry: this._triangle,
            },
        ];

        return true;
    }

    /**
     * Uninitializes buffers, geometry and program.
     */
    protected onUninitialize(): void {
        super.uninitialize();

        this._programSettings.forEach((ps) => {
            ps.program.uninitialize();
            ps.geometry.uninitialize();
        });

        this._defaultFBO.uninitialize();
    }

    /**
     * This is invoked in order to check if rendering of a frame is required by
     * means of implementation specific evaluation (e.g., lazy non continuous
     * rendering). Regardless of the return value a new frame (preparation,
     * frame, swap) might be invoked anyway, e.g., when update is forced or
     * canvas or context properties have changed or the renderer was
     * invalidated @see{@link invalidate}.
     * @returns whether to redraw
     */
    protected onUpdate(): boolean {
        return this._altered.any;
    }

    /**
     * This is invoked in order to prepare rendering of one or more frames,
     * regarding multi-frame rendering and camera-updates.
     */
    protected onPrepare(): void {
        this.clearColor = [0, 0, 0, 1];
        if (this._altered.clearColor) {
            this._defaultFBO.clearColor(this._clearColor);
        }

        this._altered.reset();
    }


    /**
     * This is invoked after both onUpdate and onPrepare and should be used to
     * do the actual rendering.
     */
    protected onFrame(): void {
        // store gl object locally for easier access
        const gl = this._context.gl;

        // set camera viewport to canvas size
        gl.viewport(0, 0, this._canvasSize[0], this._canvasSize[1]);

        // activate framebuffer for rendering
        this._defaultFBO.bind();
        // reset framebuffer
        this._defaultFBO.clear(
            gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT, true, false);

        const programSettings = this._programSettings[this._selectedProgram];

        // activate shader program
        programSettings.program.bind();

        // set uniforms (shader inputs)
        gl.uniform2f(
            programSettings.uResolution,
            this._canvasSize[0],
            this._canvasSize[1]);
        gl.uniform2fv(programSettings.uPoints, this._vertices);
        gl.uniform3fv(programSettings.uVertexColors, this._vertexColors);

        // activate, render and deactivate the screen-aligned quad
        programSettings.geometry.bind();
        programSettings.geometry.draw();
        programSettings.geometry.unbind();

        // deactivate shader program
        programSettings.program.unbind();
    }

    protected onSwap(): void { }

    protected onDiscarded(): void {
    }

    public get modes(): string [] {
        return this._programSettings.map((p) => p.name);
    }

    public set mode(index: number) {
        this._selectedProgram = index;
        this.invalidate(true);
    }

    public setVertexColor(
        index: number, hexColor: string
    ): void {
        const color = Color.hex2rgba(hexColor);
        this._vertexColors[index * 3 + 0] = color[0];
        this._vertexColors[index * 3 + 1] = color[1];
        this._vertexColors[index * 3 + 2] = color[2];
        this._triangle.setColors(this._vertexColors);
        this.invalidate(true);
    }

    public setVertexPositions(
        vertices: Float32Array
    ): void {
        this._vertices = vertices;
        this._triangle.setVertices(vertices.map((val) => {
            return val * 2 - 1;
        }));
        this.invalidate(true);
    }
}
