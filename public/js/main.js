import * as speechRecognition from "./speechRecognition.js";

speechRecognition.enable_debug();
speechRecognition.init_speech_recognition();

const recognition_process = data =>{
    document.getElementById("TextDetection").innerText = data;
}

document.getElementById("BeginRecognition").onmousedown = ()=>{
    speechRecognition.start_recognition();
    document.getElementById("BeginRecognition").innerText = "reconociento"
}

document.getElementById("BeginRecognition").onmouseup = ()=>{
    speechRecognition.stop_recognition();
    document.getElementById("BeginRecognition").innerText = "Empezar reconocimiento"
}




speechRecognition.set_process_recognition(recognition_process);


