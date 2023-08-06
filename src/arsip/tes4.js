import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const App = () => {
  const webcamRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  useEffect(() => {
    let intervalId;

    if (recording) {
      intervalId = setInterval(() => {
        sendVideoToServer();
      }, 10000);
    } else {
      clearInterval(intervalId);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [recording]);

  const captureVideo = async () => {
    const stream = webcamRef.current.video.srcObject;
    if (!stream) return;

    const mediaRecorder = new MediaRecorder(stream);
    setMediaRecorder(mediaRecorder);

    const chunks = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const videoBlob = new Blob(chunks, { type: "video/webm" });
      console.log("videoBlob:", videoBlob);
      sendVideoToServer(videoBlob);
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const sendVideoToServer = async (videoBlob) => {
    try {
      const formData = new FormData();
      formData.append("video", videoBlob, "recorded.webm");

      const response = await axios.post("http://localhost:5050/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Server response:", response.data);
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  return (
    <div>
      <Webcam audio={false} ref={webcamRef} />
      {recording ? (
        <button onClick={stopRecording}>Berhenti Rekam</button>
      ) : (
        <button onClick={captureVideo}>Mulai Rekam</button>
      )}
    </div>
  );
};

export default App;
