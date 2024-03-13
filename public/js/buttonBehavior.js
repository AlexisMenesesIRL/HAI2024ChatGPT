import * as speechRecognition from "./speechRecognition.js";

speechRecognition.enable_debug();
speechRecognition.init_speech_recognition();

const recognition_process = data =>{
    document.getElementById("TextDetection").innerText = data;
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