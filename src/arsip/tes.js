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
    let intervalId;

    if (recording) {
      intervalId = setInterval(async () => {
        const videoBlob = await getVideoBlob();
        console.log("videoBlob:", videoBlob); 
        sendVideoToServer(videoBlob);
      }, 10000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [recording]);

  const stopRecording = async () => {
    setRecording(false);
    // const videoBlob = await getVideoBlob();
    // console.log("videoBlob:", videoBlob); // Tambahkan log untuk melihat videoBlob yang dihasilkan
    // sendVideoToServer(videoBlob);
  };
  

  const getVideoBlob = () => {
    const canvas = webcamRef.current.getCanvas();
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Blob conversion failed"));
        }
        resolve(blob);
      }, "video/webm"); // Format video harus disetel ke "video/webm"
    });
  };

  const sendVideoToServer = async (videoBlob) => {
    try {
      const formData = new FormData();
      formData.append("video", videoBlob);
  
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
        <button onClick={stopRecording}>Stop Rekam</button>
      ) : (
        <button onClick={captureVideo}>Mulai Rekam</button>
      )}
    </div>
  );
};

export default App;
