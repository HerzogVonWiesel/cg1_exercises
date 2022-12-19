import {
    Camera,
    ChangeLookup,
    Context,
    DefaultFramebuffer,
    EventHandler,
    EventProvider,
    Framebuffer,
    GLTFLoader,
    Invalidate,
    Renderer,
    vec2,
    vec3,
} from 'webgl-operate';

import { ModelPass } from './modelPass';
import { Rotation } from './rotation';
import { clamp } from './clamp';
import { updateCamera } from './updateCamera';
export class DollyZoomRenderer extends Renderer {
    protected readonly _altered = Object.assign(new ChangeLookup(), {
        any: false,
        multiFrameNumber: false,
        frameSize: false,
        canvasSize: false,
        framePrecision: false,
        clearColor: false,
        debugTexture: false,
        model: false,
        camera: false
    });

    protected _fbo: Framebuffer;
    protected _modelPass: ModelPass;

    protected _camera: Camera;

    protected _viewTarget = vec3.create();
    protected _rotation = { longitude: 0, latitude: 0 } as Rotation;
    protected _endrotation = { longitude: 0, latitude: 0 } as Rotation;
    protected _eventHandler: EventHandler;
    protected _startPoint: vec2;
    protected _navSensitivity: number;

    protected _interpolateFactor = 0;
    protected _focalWidth = 0;
    protected _minDist = 0;
    protected _maxDist = 0;

    protected onMouseDown(events: Array<MouseEvent>): void {
        const event = events[events.length - 1];
        this._startPoint = this._eventHandler.offsets(event)[0];
    }

    protected onMouseMove(events: Array<MouseEvent>): void {
        if (this._startPoint === undefined) {
            return;
        }
        const event: MouseEvent = events[events.length - 1];
        const point = this._eventHandler.offsets(event)[0];

        const diff = vec2.subtract(vec2.create(), point, this._startPoint);
        vec2.scale(diff, diff, window.devicePixelRatio * this._navSensitivity);

        this._rotation.longitude -= diff[0];
        this._rotation.longitude = this._rotation.longitude % (Math.PI * 2);
        this._rotation.latitude -= diff[1];
        const hPi = Math.PI / 2;
        this._rotation.latitude = clamp(this._rotation.latitude, -hPi, hPi);

        this._altered.alter('camera');

        this._startPoint = point;
    }

    protected onMouseUp(): void {
        this._startPoint = undefined;
    }

    /**
     * Initializes and sets up rendering passes, loads a font face
     * and links shaders with program.
     * @param context - valid context to create the object for.
     * @param identifier - meaningful name for identification of this instance.
     * @param eventProvider - required for mouse interaction
     * @returns - whether initialization was successful
     */
    protected onInitialize(
        context: Context,
        invalidate: Invalidate,
        eventProvider: EventProvider
    ): boolean {
        this._fbo = new DefaultFramebuffer(this._context, 'DefaultFBO');
        this._fbo.initialize();

        // Create and configure camera.
        this._camera = new Camera();
        this._camera.near = 0.1;
        this._camera.far = 64.0;

        // Create and configure render pass
        this._modelPass = new ModelPass(context);
        this._modelPass.initialize();
        this._modelPass.camera = this._camera;
        this._modelPass.target = this._fbo;

        // Navigation
        this._eventHandler = new EventHandler(invalidate, eventProvider);
        this._eventHandler.pushMouseDownHandler(this.onMouseDown.bind(this));
        this._eventHandler.pushMouseMoveHandler(this.onMouseMove.bind(this));
        this._eventHandler.pushMouseUpHandler(this.onMouseUp.bind(this));
        this._eventHandler.pushMouseLeaveHandler(this.onMouseUp.bind(this));
        this._navSensitivity = 0.002;

        return true;
    }

    /**
     * Clean up.
     */
    protected onUninitialize(): void {
        super.uninitialize();

        this._modelPass.uninitialize();
        this._fbo.uninitialize();
    }

    /**
     * This is invoked in order to check if rendering of a frame is required by
     * means of implementation specific evaluation (e.g., lazy non continuous
     * rendering). Regardless of the return value a new frame (preparation,
     * frame, swap) might be invoked anyway, e.g., when update is forced or
     * canvas or context properties have changed or the renderer was invalidated
     * @see{@link invalidate}.
     * Updates the AntiAliasingKernel.
     * @returns whether to redraw
     */
    protected onUpdate(): boolean {
        this._eventHandler.update();
        this._modelPass.update();

        return this._altered.any || this._camera.altered;
    }

    /**
     * This is invoked in order to prepare rendering of one or more frames,
     * regarding multi-frame rendering and camera-updates.
     */
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

        if (this._altered.camera || this._altered.model) {
            updateCamera(
                this._viewTarget,
                this._rotation,
                this._endrotation,
                this._minDist,
                this._maxDist,
                this._interpolateFactor,
                this._focalWidth,
                this._camera
            );
        }

        this._modelPass.prepare();

        this._altered.reset();
        this._camera.altered = false;
    }

    /**
     * Renders a new frame.
     */
    protected onFrame(): void {
        this._modelPass.frame();
    }

    protected onSwap(): void {
    }

    /**
     * Load asset from URI specified by the HTML select
     */
    public loadAsset(model: string): Promise<void> {
        const loader = new GLTFLoader(this._context);
        return new Promise<void>((resolve) => {
            loader.loadAsset(model)
                .then(() => {
                    this._modelPass.scene = loader.defaultScene;
                    this._altered.alter('model');
                    resolve();
                });
        });
    }

    protected onDiscarded(): void {
    }

    protected invalidateCam(): void {
        this._altered.alter('camera');
        this.invalidate();
    }

    public set viewTarget(value: vec3) {
        this._viewTarget = value;
        this.invalidateCam();
    }

    public set interpolateFactor(value: number) {
        this._interpolateFactor = value;
        this.invalidateCam();
    }

    public set focalWidth(value: number) {
        this._focalWidth = value;
        this.invalidateCam();
    }

    public set minDist(value: number) {
        this._minDist = value;
        this.invalidateCam();
    }

    public set maxDist(value: number) {
        this._maxDist = value;
        this.invalidateCam();
    }

    public set latitude(value: number) {
        this._rotation.latitude = value;
        this.invalidateCam();
    }

    public set longitude(value: number) {
        this._rotation.longitude = value;
        this.invalidateCam();
    }

    public set endlatitude(value: number) {
        this._endrotation.latitude = value;
        this.invalidateCam();
    }

    public set endlongitude(value: number) {
        this._endrotation.longitude = value;
        this.invalidateCam();
    }
}
