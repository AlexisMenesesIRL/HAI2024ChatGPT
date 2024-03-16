const {
    Application,
    live2d: { Live2DModel },
} = PIXI;

// Kalidokit provides a simple easing function
// (linear interpolation) used for animation smoothness
// you can use a more advanced easing function if you want
// Url to Live2D
const modelUrl = "../hiyori/hiyori_pro_t10.model3.json";

let currentModel;

const videoElement = document.querySelector(".input_video"),
    guideCanvas = document.querySelector("canvas.guides");

(async function main() {
    // create pixi application
    const app = new PIXI.Application({
        view: document.getElementById("live2d"),
        autoStart: true,
        backgroundAlpha: 0,
        backgroundColor: 0xffffff,
        resizeTo: window,
    });

    // load live2d model
    currentModel = await Live2DModel.from(modelUrl, { autoInteract: false });
    currentModel.scale.set(0.4);
    currentModel.interactive = true;
    currentModel.anchor.set(0.5, 0.5);
    currentModel.position.set(window.innerWidth * 0.5, window.innerHeight * 0.8);

    // Add events to drag model
    currentModel.on("pointerdown", (e) => {
        currentModel.offsetX = e.data.global.x - currentModel.position.x;
        currentModel.offsetY = e.data.global.y - currentModel.position.y;
        currentModel.dragging = true;
    });
    currentModel.on("pointerup", (e) => {
        currentModel.dragging = false;
    });
    currentModel.on("pointermove", (e) => {
        if (currentModel.dragging) {
            currentModel.position.set(e.data.global.x - currentModel.offsetX, e.data.global.y - currentModel.offsetY);
        }
    });

    // Add mousewheel events to scale model
    // document.querySelector("#live2d").addEventListener("wheel", (e) => {
    //     e.preventDefault();
    //     currentModel.scale.set(clamp(currentModel.scale.x + event.deltaY * -0.001, -0.5, 10));
    // });

    // add live2d model to stage
    app.stage.addChild(currentModel);
    window.currentModel = currentModel;
})();


window.mover_boca = (x,y, lerpAmount = 0.7) => {

    const coreModel = currentModel.internalModel.coreModel;

    currentModel.internalModel.motionManager.update = (...args) => {

        let mouth_value = (coreModel.getParameterValueById("ParamMouthOpenY")-y)*0.3;
        coreModel.setParameterValueById(
            "ParamMouthOpenY",
            //lerp(y, coreModel.getParameterValueById("ParamMouthOpenY"), 0.3)
            (coreModel.getParameterValueById("ParamMouthOpenY") - y)*0.3 + y
        );
        // Adding 0.3 to ParamMouthForm to make default more of a "smile"
        // coreModel.setParameterValueById(
        //     "ParamMouthForm",
        //     0.3 + (coreModel.getParameterValueById("ParamMouthOpenY") - x)*0.3 + x
        // );
    };
};