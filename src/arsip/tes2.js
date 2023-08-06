import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const App = () => {
  const webcamRef = useRef(null);
  const [recording, setRecording] = useState(false);

  const captureVideo = () => {
    setRecording(true);
  };

  useEffect(() => {
    let mediaRecorder;
    const chunks = [];

    if (recording) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const videoBlob = new Blob(chunks, { type: "video/webm" });
          console.log("videoBlob:", videoBlob);
          sendVideoToServer(videoBlob);
          chunks.length = 0;
        };

        mediaRecorder.start(10000); // Recording every 10 seconds
      });
    }

    return () => {
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
      }
    };
  }, [recording]);

  const stopRecording = () => {
    setRecording(false);
  };

  const sendVideoToServer = async (videoBlob) => {
    try {
      const formData = new FormData();
      formData.append("video", videoBlob);

      const response = await axios.post(
        "http://localhost:5050/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Server response:", response.data);
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  return (
    <div>
      <Webcam audio={false} ref={webcamRef} />
      {recording ? (
        <button onClick={stopRecording}>Stop Rekam</button>
      ) : (
        <button onClick={captureVideo}>Mulai Rekam</button>
      )}
    </div>
  );
};

export default App;
