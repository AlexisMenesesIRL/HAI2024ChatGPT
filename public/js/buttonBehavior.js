import * as ws from "./webSocketConnection.js";
import * as speechRecognition from "./speechRecognition.js";
import * as synthetizer from "./speechSynthesis.js"

speechRecognition.enable_debug();
speechRecognition.init_speech_recognition();
let is_speaking = false;

let speech_random = (x,y) => {
    const coreModel = currentModel.internalModel.coreModel;
    if(is_speaking){
        mover_boca(2,Math.random());
        setTimeout(()=>{ speech_random(x,y)},100);
    } else{
        mover_boca(2,0);
    }
}

synthetizer.set_onEnd_synthetizer( ()=>{ 
    is_speaking = false;
    buttonRecognition.disabled = false;
    console.log("El audio sintetizado ha terminado");
 });

const recognition_process = data =>{
    document.getElementById("TextDetection").innerText = data;
    stop_recognition();
    ws.send({"action":"answerChat",message:data});
}

let process_message = (message)=>{
    let process_message = JSON.parse(message);
    if(process_message.action == "gpt_answer" ) {
        synthetizer.change_pitch(1.5);
        document.getElementById("GPTAnswer").innerText = process_message.message;
        synthetizer.say(process_message.message); 
        is_speaking = true;
        speech_random(0,0);
    }
}

ws.set_websocket_message_processing_function(process_message);


let recognition_started = false;
let mouse_hover = true;
let buttonRecognition = document.getElementById("BeginRecognition");


let stop_recognition = () =>{
    speechRecognition.stop_recognition();
    buttonRecognition.style.background = "#38e08c"
    buttonRecognition.innerText = "Empezar reconocimiento"
    recognition_started = false;
    buttonRecognition.disabled = true;
}

buttonRecognition.onmousedown = ()=>{
    if(!recognition_started){
        speechRecognition.start_recognition();
        recognition_started = true;
        buttonRecognition.innerText = "reconociento"
        buttonRecognition.style.background = "#FF0000"
    } else{
        stop_recognition();
    }
    
}

buttonRecognition.onmouseup = (e)=>{
    if(mouse_hover) {
        stop_recognition();
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