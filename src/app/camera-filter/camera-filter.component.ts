import { Component, OnInit } from '@angular/core';
declare var MediaRecorder: any;
declare var window: any;
@Component({
  selector: 'app-camera-filter',
  templateUrl: './camera-filter.component.html',
  styleUrls: ['./camera-filter.component.scss']
})
export class CameraFilterComponent implements OnInit {
  recordedBlobs:any = [];
  mediaRecorder: any;
  stream:MediaStream;
  recordingStatus: boolean = false;
  filterList = [
    { id:'normal', name:'Normal' ,filter:'none'},
    { id:'fade', name:'Fade', filter:'brightness(200%) grayscale(0.5)'},
    { id:'instant', name:'Instant', filter: 'sepia(1)'},
    { id:'mono', name:'Mono', filter: 'grayscale(1)'},
    { id:'noir', name:'Noir', filter:'grayscale(0.7)'},
    { id:'process', name:'Process', filter:'url(#processid)'},
    { id:'tonal', name:'Tonal', filter:'url(#tonalid)'},
    { id:'transfer', name:'Transfer', filter: 'url(#transferid)'},
  ];
  filterIdList = ['normal','fade','instant','mono','noir','process','tonal','transfer'];
  constructor() { }

  ngOnInit() {
    this.initializeCamera();
  }

  initializeCamera(){
    console.log("MediaRecorder:",MediaRecorder);

    const filterSelect:any = document.querySelector('select#filter');
    // const recordButton: any = document.querySelector('button#record');
    // const downloadButton :any = document.querySelector('button#download');
    // const videoPlayer:any = document.querySelector('video#videoPlayer');
    // console.log("dsdsds:",videoPlayer);
    // downloadButton.onclick = ()=> this.downloadVideo();
    // recordButton.onclick = ()=> this.toggleRecording();
    // Put variables in global scope to make them available to the browser console.
    const video:any = document.getElementById('videoRecorder');
    const canvas:any  = document.querySelector('canvas');
    // canvas.width = 480;
    // canvas.height = 360;
    
    
    // filterSelect.onchange = ()=> {
    //   console.log("Changed");
    //   // video.className = filterSelect.value;
    //   // canvas.className = filterSelect.value;
    //   // this.stream = canvas.captureStream();
    //   const ctx = canvas.getContext("2d");
    //   ctx.filter = "url(#duotone)"; //"grayscale(100%)"
    //   this.step(ctx,video,canvas);
    // };

    const constraints = {
      audio: true,
      video: { facingMode: "user" }
    };

    

    function handleError(error) {
      console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
    }

    navigator.mediaDevices.getUserMedia(constraints).then((stream)=>this.handleSuccess(stream, video, canvas)).catch(handleError);
  }

  setFilter(selectedFilter){
    const canvas:any  = document.querySelector('canvas');
    const video:any = document.getElementById('videoRecorder');
    const ctx = canvas.getContext("2d");
    ctx.filter = selectedFilter.filter; //"url(#duotone)"; //"grayscale(100%)"
    // canvas.className = "canvasPlayerSectionChildren " + selectedFilter['id'];
    this.step(ctx,video,canvas);
  }
  handleSuccess(stream, video, canvas) {
    
    video.srcObject = stream;

    this.filterIdList.forEach(filterId => {
      const filterVideo: any = document.getElementById(filterId);
      filterVideo.srcObject = stream;
      filterVideo.muted = true;
      filterVideo.className = "filter-video-element "+filterId;
    });
    
    video.muted = true;
    video.setAttribute('playsinline', '');
    setTimeout(() => {
      video.play();
    });
    video.addEventListener('loadedmetadata', () => {
      console.log("video:",video);
      let videoPlayer:any = document.getElementById('displayVideo');
      console.log("videoPlayer:",videoPlayer);
      canvas.width  = video.videoWidth;
      canvas.height  = video.videoHeight;
      // let buttonContainer:any = document.getElementById('buttonContainer');
      // buttonContainer.style.top = (video.videoHeight - 50)+"px";
      // videoPlayer.width = video.videoWidth;
      // videoPlayer.height = video.videoHeight;
      // videoPlayer.setAttribute('height', video.videoHeight + 'px !important;');
      console.log("canvas.height:",video.videoHeight);
      // videoPlayer.setAttribute('width', canvas.width + 'px !important;')
      const ctx = canvas.getContext("2d",{alpha: false});
      ctx.setTransform(-1,0,0,1,canvas.width,0); // disables inverted image
      
      // ctx.filter = "grayscale(100%)"  // sets filter
      this.step(ctx,video,canvas);
      let canvasStream = canvas.captureStream();
      if (stream.getAudioTracks().length) {
        canvasStream.addTrack(stream.getAudioTracks()[0]);
      }
      this.stream = canvasStream;

    });

  }
  step(ctx,video,canvas) {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    requestAnimationFrame(()=>this.step(ctx,video,canvas))
  }
  startRecording() {
    let options:any = {mimeType: 'video/webm;codecs=vp9,opus'};
    this.recordedBlobs = [];
    const displayVideo:any = document.getElementById('displayVideo');
    displayVideo.style.visibility = 'hidden';
    displayVideo.pause();
    displayVideo.removeAttribute('src');
    displayVideo.load();
    

    try {
      this.mediaRecorder = new MediaRecorder(this.stream, options);
    } catch (e0) {
      console.log('Unable to create MediaRecorder with options Object: ', e0);
      try {
        options = {mimeType: 'video/webm,codecs=vp9'};
        this.mediaRecorder = new MediaRecorder(this.stream, options);
      } catch (e1) {
        console.log('Unable to create MediaRecorder with options Object: ', e1);
        try {
          options = 'video/vp8'; // Chrome 47
          this.mediaRecorder = new MediaRecorder(this.stream, options);
        } catch (e2) {
          alert('MediaRecorder is not supported by this browser.\n\n' +
            'Try Firefox 29 or later, or Chrome 47 or later, ' +
            'with Enable experimental Web Platform features enabled from chrome://flags.');
          console.error('Exception while creating MediaRecorder:', e2);
          return;
        }
      }
    }
    // const recordButton: any = document.querySelector('button#record');
    // const playButton:any = document.querySelector('button#play');
    // const downloadButton:any = document.querySelector('button#download');
    console.log('Created MediaRecorder', this.mediaRecorder, 'with options', options);
    // recordButton.textContent = 'Stop Recording';
    // playButton.disabled = true;
    // downloadButton.disabled = true;
    this.mediaRecorder.onstop =  (event)=> this.handleStop(event);
    this.mediaRecorder.ondataavailable =(event)=> this.handleDataAvailable(event);
    this.mediaRecorder.start(10); // collect 10ms of data
    console.log('MediaRecorder started', this.mediaRecorder);
  }
  handleStop(event) {
    console.log('Recorder stopped: ', event);
    const superBuffer = new Blob(this.recordedBlobs, {type: 'video/webm'});
    const video:any = document.getElementById('displayVideo');
    video.style.visibility = 'visible';
    video.src = window.URL.createObjectURL(superBuffer);
  }
  handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
      // console.log("event.data.size:",event.data.size)
      this.recordedBlobs.push(event.data);
    }
  }
  stopRecording() {
    this.mediaRecorder.stop();
    // const video:any = document.querySelector('video');
    // video.controls = true;
  }
  toggleRecording() {
    // const recordButton: any = document.querySelector('button#record');
    // const playButton:any = document.querySelector('button#play');
    // const downloadButton:any = document.querySelector('button#download');
    if (!this.recordingStatus) {
      this.startRecording();
      this.recordingStatus = true;
      document.getElementById('filter-container').style.visibility = 'hidden';
    } else {
      this.stopRecording();
      this.recordingStatus = false;
      // document.getElementById('filter-container').style.visibility = 'visible';
      // recordButton.textContent = 'Start Recording';
      // playButton.disabled = false;
      // downloadButton.disabled = false;
    }
  }

  downloadVideo(){
    const blob = new Blob(this.recordedBlobs, {type: 'video/webm'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'test.webm';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  }

  cancelVideo(){
    document.getElementById('filter-container').style.visibility = 'visible';
    const video:any = document.getElementById('displayVideo');
    video.pause();
    video.removeAttribute('src');
    video.load();
    video.style.visibility = 'hidden';
    this.recordedBlobs = [];
  }
}
