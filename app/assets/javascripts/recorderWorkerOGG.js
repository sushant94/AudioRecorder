var recLength = 0,
  recBufferL = [],
  recBufferR = [],
  sampleRate,
  audioContext;

  this.onmessage = function(e){
  switch(e.data.command){
    case 'init':
      init(e.data.config);
      break;
    case 'record':
      record(e.data.buffer);
      break;
    case 'getBuffer':
      getBuffer(e.buffer);
      break;
      case 'getData':
      getData();
      break;
  }
};
  function init(config){
    sampleRate = config;

  }
function record(inputBuffer){
  recBufferL.push(inputBuffer[0]);
  recBufferR.push(inputBuffer[1]);
  recLength += inputBuffer[0].length;
}
function getBuffer(z)
{
        console.log(recBufferL.length)
        var playBuffer = z
        playBuffer.getChannelData(0).set(recBufferL);
        playBuffer.getChannelData(1).set(recBufferR);
        this.postMessage(playBuffer);
}
function getData()
{
    console.log(recBufferL.length);
    this.postMessage({bl: recLength,sr: sampleRate});
}
