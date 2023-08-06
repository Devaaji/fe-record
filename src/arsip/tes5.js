import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

function App() {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const startRecording = () => {
    const stream = webcamRef.current.video.srcObject;
    const mediaRecorder = new MediaRecorder(stream);

    const chunks = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      await uploadVideo(blob);

      chunks.length = 0;
    };

    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.start();
    setRecording(true);

    // Upload video every 10 seconds
    const id = setInterval(() => {
      if (mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.start();
      }
    }, 10000);
    setIntervalId(id);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);

    clearInterval(intervalId);
  };

  const uploadVideo = async (videoBlob) => {
    try {
      const formData = new FormData();
      formData.append('video', videoBlob);

      await axios.post('http://localhost:5050/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Video uploaded successfully');
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  };

  const videoConstraints = {
    facingMode: 'user',
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Webcam Video Recorder</h1>
        <Webcam audio={false} videoConstraints={videoConstraints} ref={webcamRef} />
        <div>
          {recording ? (
            <button onClick={stopRecording}>Stop Recording</button>
          ) : (
            <button onClick={startRecording}>Start Recording</button>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
