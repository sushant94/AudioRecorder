window.AudioContext = window.AudioContext || window.webkitAudioContext;

var recordB = document.querySelector("#record");
var audioContext = new AudioContext();
var audioInput = null,
       realAudioInput = null,
       inputPoint  =null,
       audioRecorder = null;

var recIndex = 0;

function gotBuffers( buffers ) {
    audioRecorder.exportWAV( doneEncoding );
}

function doneEncoding( blob ) {
    //Write code to save data to server instead

    // Recorder.save( blob, "myRecording" + ((recIndex<10)?"0":"") + recIndex + ".wav" );
    Recorder.setupDownload( blob, "myRecording" + ((recIndex<10)?"0":"") + recIndex + ".wav" );
    recIndex++;

}

function toggleRecording( e ) {
    if (e.classList.contains("recording")) {
        console.log("Stopped");
        audioRecorder.stop();
        e.classList.remove("recording");
        audioRecorder.getBuffers( gotBuffers );
        document.querySelector("#record").src = "/assets/recp.png"
        document.querySelector("#message").innerHTML = "Click save to download your file!";
    } else {
        if (!audioRecorder)
            return;
        e.classList.add("recording");
        audioRecorder.clear();
        audioRecorder.record();
        console.log("started");
        document.querySelector("#record").src = "/assets/rec.png"
    }
}


function gotStream(stream) {

    inputPoint = audioContext.createGain();

    realAudioInput = audioContext.createMediaStreamSource(stream);
    audioInput = realAudioInput;
    audioInput.connect(inputPoint);

    audioRecorder = new Recorder(inputPoint);

    zeroGain = audioContext.createGain();
    zeroGain.gain.value=0.0;
    inputPoint.connect(zeroGain);
    zeroGain.connect(audioContext.destination);

}


function initAudio() {

    navigator.getMedia = (   navigator.getUserMedia||
                                            navigator.webkitGetUserMedia||
                                            navigator.mozGetUserMedia||
                                            navigator.msGetUserMedia);

    navigator.getMedia({audio: true},gotStream,function(e){
        console.log("Error getting audio "+e);
    });
}

window.addEventListener('load',initAudio);

