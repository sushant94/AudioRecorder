(function(window){

  var WORKER_PATH = '/assets/recorderWorker.js';

  var Recorder = function(source, cfg){
    var config = cfg || {};
    var bufferLen = config.bufferLen || 4096;
    this.context = source.context;
    if(!this.context.createScriptProcessor){
       this.node = this.context.createJavaScriptNode(bufferLen, 2, 2);
    } else {
       this.node = this.context.createScriptProcessor(bufferLen, 2, 2);
    }

    function setState()
    {
      var state = document.getElementById("state");
      if(recording==0) {
        state.innerHTML ="State: Stopped";
        state.style.color = "#AB0000";
      }
      else if(recording==1) {
        state.innerHTML ="State: Recording";
        state.style.color = "#03BD00";
      }
      else if(recording==2) {
        state.innerHTML ="State: Paused";
        state.style.color = "#E38B00";
      }
    }

    var worker = new Worker(config.workerPath || WORKER_PATH);
    worker.postMessage({
      command: 'init',
      config: {
        sampleRate: this.context.sampleRate
      }
    });
    //Stopped = 0; Recording = 1; Paused = 2
    var recording = 0,
      currCallback;

    this.node.onaudioprocess = function(e){
      if (!(recording==1)) return;
      worker.postMessage({
        command: 'record',
        buffer: [
          e.inputBuffer.getChannelData(0),
          e.inputBuffer.getChannelData(1)
        ]
      });
    }

    this.configure = function(cfg){
      for (var prop in cfg){
        if (cfg.hasOwnProperty(prop)){
          config[prop] = cfg[prop];
        }
      }
    }

    this.record = function(){
      recording = 1;
      setState();
    }

    this.stop = function(){
      if(recording == 1) {
        recording = 0;
        setState();
        return true;
      } else {
        alert("Recording paused. Resume before stopping!");
        return false;
      }
    }

    this.pause = function(){
      if(recording == 1) {
        recording = 2;
        setState();
        return true;
      } else {
        alert("Recording not in progress!");
        return false;
      }

    }

    this.resume = function(){
      if(recording == 2) {
        recording = 1;
         setState();
        return true;
      } else {
        alert("Recording not paused or has not started!");
        return false;
      }

    }

    this.clear = function(){
      worker.postMessage({ command: 'clear' });
    }

    this.getBuffers = function(cb) {
      currCallback = cb || config.callback;
      worker.postMessage({ command: 'getBuffers' })
    }

    this.exportWAV = function(cb, type){
      currCallback = cb || config.callback;
      type = type || config.type || 'audio/wav';
      if (!currCallback) throw new Error('Callback not set');
      worker.postMessage({
        command: 'exportWAV',
        type: type
      });
    }

    worker.onmessage = function(e){
      var blob = e.data;
      currCallback(blob);
    }

    source.connect(this.node);
    this.node.connect(this.context.destination);   // if the script node is not connected to an output the "onaudioprocess" event is not triggered in chrome.
  };

  Recorder.save = function(blob, filename){

    console.log("Requesting");
    var data = new FormData();
    data.append("record[audio]", blob, filename);
    var oReq = new XMLHttpRequest();
    oReq.open("POST","/saveRecording");
    oReq.send(data);
    oReq.onload = function(oEvent) {
        if(oReq.status == 200) {
            console.log("Uploaded Successfully");

        } else {
            console.log("Error " + oReq.status);
        }

    };
  }

    Recorder.setupDownload = function(blob, filename){
    var url = (window.URL || window.webkitURL).createObjectURL(blob);
    var link = document.getElementById("save");
    link.href = url;
    link.download = filename || 'output.wav';
  }

  window.Recorder = Recorder;

})(window);
