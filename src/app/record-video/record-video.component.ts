import { Component, OnInit } from '@angular/core';
declare var MediaRecorder: any;
declare var window: any;
@Component({
  selector: 'app-record-video',
  templateUrl: './record-video.component.html',
  styleUrls: ['./record-video.component.scss']
})
export class RecordVideoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const mediaSource = new MediaSource();
    mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
    let mediaRecorder;
    let recordedBlobs;
    let sourceBuffer;

    const canvas:any = document.querySelector('canvas');
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(100, 75, 50, 0, 2 * Math.PI);
    ctx.fillStyle ='green';
    ctx.fill();
    ctx.stroke();
    const video:any = document.querySelector('video');

    const recordButton: any = document.querySelector('button#record');
    const playButton:any = document.querySelector('button#play');
    const downloadButton:any = document.querySelector('button#download');
    recordButton.onclick = toggleRecording;
    playButton.onclick = play;
    downloadButton.onclick = download;

    // Start the GL teapot on the canvas
    // main();

    const stream = canvas.captureStream(); // frames per second
    console.log('Started stream capture from canvas element: ', stream);

    function handleSourceOpen(event) {
      console.log('MediaSource opened');
      sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
      console.log('Source buffer: ', sourceBuffer);
    }

    function handleDataAvailable(event) {
      if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
      }
    }

    function handleStop(event) {
      console.log('Recorder stopped: ', event);
      const superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
      video.src = window.URL.createObjectURL(superBuffer);
    }

    function toggleRecording() {
      if (recordButton.textContent === 'Start Recording') {
        startRecording();
      } else {
        stopRecording();
        recordButton.textContent = 'Start Recording';
        playButton.disabled = false;
        downloadButton.disabled = false;
      }
    }

    // The nested try blocks will be simplified when Chrome 47 moves to Stable
    function startRecording() {
      let options:any = {mimeType: 'video/webm'};
      recordedBlobs = [];
      try {
        mediaRecorder = new MediaRecorder(stream, options);
      } catch (e0) {
        console.log('Unable to create MediaRecorder with options Object: ', e0);
        try {
          options = {mimeType: 'video/webm,codecs=vp9'};
          mediaRecorder = new MediaRecorder(stream, options);
        } catch (e1) {
          console.log('Unable to create MediaRecorder with options Object: ', e1);
          try {
            options = 'video/vp8'; // Chrome 47
            mediaRecorder = new MediaRecorder(stream, options);
          } catch (e2) {
            alert('MediaRecorder is not supported by this browser.\n\n' +
              'Try Firefox 29 or later, or Chrome 47 or later, ' +
              'with Enable experimental Web Platform features enabled from chrome://flags.');
            console.error('Exception while creating MediaRecorder:', e2);
            return;
          }
        }
      }
      console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
      recordButton.textContent = 'Stop Recording';
      playButton.disabled = true;
      downloadButton.disabled = true;
      mediaRecorder.onstop = handleStop;
      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.start(100); // collect 100ms of data
      console.log('MediaRecorder started', mediaRecorder);
    }

    function stopRecording() {
      mediaRecorder.stop();
      console.log('Recorded Blobs: ', recordedBlobs);
      video.controls = true;
    }

    function play() {
      video.play();
    }

    function download() {
      const blob = new Blob(recordedBlobs, {type: 'video/webm'});
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
  }

}
