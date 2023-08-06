import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const App = () => {
  const webcamRef = useRef(null);
  const [recording, setRecording] = useState(false);

  const captureVideo = () => {
    setRecording(true);
  };

  // useEffect(() => {
  //   let mediaRecorder;
  //   const chunks = [];

  //   if (recording) {
  //     navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  //       mediaRecorder = new MediaRecorder(stream);

  //       mediaRecorder.ondataavailable = (event) => {
  //         if (event.data.size > 0) {
  //           chunks.push(event.data);
  //         }
  //       };

  //       mediaRecorder.onstop = async () => {
  //         const videoBlob = new Blob(chunks, { type: "video/webm" });
  //         console.log("videoBlob:", videoBlob);
  //         sendVideoToServer(videoBlob);
  //         chunks.length = 0;
  //         setTimeout(() => {
  //           if (recording) {
  //             mediaRecorder.start(10000); // Merekam setiap 10 detik
  //           }
  //         }, 0);
  //       };

  //       mediaRecorder.start(10000); // Merekam setiap 10 detik
  //     });
  //   }

  //   return () => {
  //     if (mediaRecorder && mediaRecorder.state !== "inactive") {
  //       mediaRecorder.stop();
  //     }
  //   };
  // }, [recording]);

  const stopRecording = () => {
    setRecording(false);
  };

  useEffect(() => {
    let intervalId;
    let mediaRecorder;
    const chunks = [];

    if (recording) {
      intervalId = setInterval(async () => {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
          mediaRecorder = new MediaRecorder(stream);
  
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              chunks.push(event.data);
            }
          };
  
            const videoBlob = new Blob(chunks, { type: "video/webm" });
            console.log("videoBlob:", videoBlob);
            sendVideoToServer(videoBlob);
            // chunks.length = 0;
            // setTimeout(() => {
            //   if (recording) {
            //     mediaRecorder.start(10000); // Merekam setiap 10 detik
            //   }
            // }, 0);
  
          // mediaRecorder.start(10000); // Merekam setiap 10 detik
        });
      }, 10000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [recording]);

  

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

      console.log("Respon dari Server:", response.data);
    } catch (error) {
      console.error("Error mengunggah video:", error);
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
