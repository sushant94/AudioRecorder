    window.AudioContext =window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();
var recording = false,
       outputBuffer = null,
       inputPoint = null,
       mediaStreamSource=null,
       audioGain = null;
       // recBufferL = [],
       // recBufferR = [],
       // recLength = 0,
        //Only 1 buffer now. Try and extend it later.

function getData(data)
{
    console.log(data);
    var z = audioContext.createBuffer(2,10,data.sr);
    audioRec.getBuffers(playAudio,z);
}



function prepareAudio() {
audioRec.getData(getData);
}

function playAudio(playBuffer){
    var playSource = audioContext.createBufferSource();
    playSource = playBuffer;
    audioGain.disconnect(0);
    playSource.connect( audioContext.destination );
}

function toggleRecord() {
    if(recording) {
        recording = false;
        prepareAudio();
        recBufferR = [];
        recBufferL = [];
        recLength = 0;
    } else {
        initAudio();
        recording = true;
        console.log(recording);
    }
}


function gotStream(stream) {


    inputPoint = audioContext.createGain();

    mediaStreamSource = audioContext.createMediaStreamSource( stream );

     audioGain = audioContext.createGain();

    audioGain.gain.value = 0.0;

    mediaStreamSource.connect(inputPoint);
    audioRec = new Recorder(inputPoint);
    inputPoint.connect(audioGain);

    audioGain.connect( audioContext.destination );

}



function initAudio(){

    navigator.getMedia = (navigator.getUserMedia||
                                          navigator.webkitGetUserMedia||
                                          navigator.mozGetUserMedia||
                                          navigator.msGetUserMedia);
    navigator.getMedia({audio: true},gotStream,function(e){
        console.log("Error getting audio "+e);
    });

}

window.addEventListener('load',initAudio);




