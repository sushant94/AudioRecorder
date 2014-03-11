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

function resetSprites() {
    document.querySelector("#pause").src = "/assets/pause.png"
    document.querySelector("#record").src = "/assets/recp.png"
}

function doneEncoding( blob ) {

    //Uncomment line below to enable save to server.
    // Recorder.save( blob, "myRecording" + ((recIndex<10)?"0":"") + recIndex + ".wav" );

    Recorder.setupDownload( blob, "myRecording" + ((recIndex<10)?"0":"") + recIndex + ".wav" );
    recIndex++;

}

function togglePauseRecording(e)
{
    if(e.classList.contains("paused")) {
        if(audioRecorder.resume()){
            console.log("Resumed");
            e.classList.remove("paused");
            document.querySelector("#pause").src = "/assets/pause.png"
        }
    } else {
        if(audioRecorder.pause()) {
            console.log("Paused");
            e.classList.add("paused");
            document.querySelector("#pause").src = "/assets/play.png"
        }
    }
}

function toggleRecording( e ) {
    if (e.classList.contains("recording")) {
        if(audioRecorder.stop()) {
            console.log("Stopped");
            e.classList.remove("recording");
            audioRecorder.getBuffers( gotBuffers );
            document.querySelector("#record").src = "/assets/recp.png"
            resetSprites();
            document.querySelector("#message").innerHTML = "Click save to download your file!";
        }
    } else {
        if (!audioRecorder)
            return;
        e.classList.add("recording");
        audioRecorder.clear();
        audioRecorder.record();
        console.log("started");
        document.querySelector("#record").src = "/assets/rec.png"
        document.querySelector("#message").innerHTML = "";
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

