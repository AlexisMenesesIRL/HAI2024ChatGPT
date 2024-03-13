import * as speechRecognition from "./speechRecognition.js";

speechRecognition.enable_debug();
speechRecognition.init_speech_recognition();

document.getElementById("BeginRecognition").onclick = ()=>{
    speechRecognition.start_reconition();
}


