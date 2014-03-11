(function(window){
    var Recorder = function(source,cfg){

      var WORKER_PATH = '/assets/recorderWorkerOGG.js';
    var worker = new Worker(WORKER_PATH);
    this.context = source.context;
    var bufferLen = 4096;
    if(!this.context.createScriptProcessor){
        this.node = this.context.createJavaScriptNode(bufferLen, 2, 2);
    } else {
        this.node = this.context.createScriptProcessor(bufferLen, 2, 2);
    }
    worker.postMessage({
      command: 'init',
      config: {
        sampleRate: this.context.sampleRate
      }
    });
    var recording = false,
    currCallback;
    this.node.onaudioprocess = function(e){
      if (!recording) return;
      worker.postMessage({
        command: 'record',
        buffer: [
          e.inputBuffer.getChannelData(0),
          e.inputBuffer.getChannelData(1)
        ]
      });
    }

    this.getData = function(cb){
        currCallback = cb;
        worker.postMessage({command: 'getData'});
    }
        this.getBuffers = function(cb,z) {
            console.log("HERE");
      currCallback = cb;
      worker.postMessage({ command: 'getBuffer' , buffer: z })
    }
        worker.onmessage = function(e){
      var buff = e.data;
      console.log("HERE");
      currCallback(e.data);
    }
};
window.Recorder = Recorder;
})(window);
