import * as speechRecognition from "./speechRecognition.js";

speechRecognition.enable_debug();
speechRecognition.init_speech_recognition();

const recognition_process = data =>{
    document.getElementById("TextDetection").innerText = data;
}

document.getElementById("BeginRecognition").onclick = ()=>{
    speechRecognition.start_reconition();
}

speechRecognition.set_process_recognition(recognition_process);


