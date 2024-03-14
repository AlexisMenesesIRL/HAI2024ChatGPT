import * as speechRecognition from "./speechRecognition.js";
import * as synthetizer from "./speechSynthesis.js"

speechRecognition.enable_debug();
speechRecognition.init_speech_recognition();
let is_speaking = false;

let speech_random = (x,y) => {
    const coreModel = currentModel.internalModel.coreModel;
    console.log("speech", x, y )
    if(is_speaking){
        mover_boca(2,Math.random());
        setTimeout(()=>{ speech_random(x,y)},100);
    } else{
        mover_boca(2,0);
    }
}

synthetizer.set_onEnd_synthetizer( ()=>{ 
    is_speaking = false;
    console.log("El audio sintetizado ha terminado");
 });

const recognition_process = data =>{
    
    document.getElementById("TextDetection").innerText = data;
    synthetizer.change_pitch(1.5);
    synthetizer.say(data); 
    is_speaking = true;
    speech_random(0,0);
}



let recognition_started = false;
let mouse_hover = true;
let buttonRecognition = document.getElementById("BeginRecognition");


buttonRecognition.onmousedown = ()=>{
    if(!recognition_started){
        speechRecognition.start_recognition();
        recognition_started = true;
        buttonRecognition.innerText = "reconociento"
        buttonRecognition.style.background = "#FF0000"
    }
    
}

buttonRecognition.onmouseup = (e)=>{
    if(mouse_hover) {
        speechRecognition.stop_recognition();
        buttonRecognition.style.background = "#38e08c"
        buttonRecognition.innerText = "Empezar reconocimiento"
        recognition_started = false;
    }
}


document.body.onmousemove = (e) => {
    let x = e.clientX;
    let y = e.clientY;
    let bounding = buttonRecognition.getBoundingClientRect();
    if(bounding.x < x && bounding.x+bounding.width > x && bounding.y < y &&  bounding.y+bounding.height > y) {
        mouse_hover = true;
    }
    else{
        mouse_hover = false
    }

}



speechRecognition.set_process_recognition(recognition_process);

const buttonBehavior = true;
export default  buttonBehavior;