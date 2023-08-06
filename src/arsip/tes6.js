import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

function App() {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [videoIndex, setVideoIndex] = useState(1);
  const [intervalId, setIntervalId] = useState(null);

  const [nameInput, setNameInput] = useState("");

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
      const blob = new Blob(chunks, { type: "video/webm" });
      await uploadVideo(blob);

      chunks.length = 0;
    };

    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.start();
    setRecording(true);

    // Upload video every 10 seconds
    const id = setInterval(() => {
      if (mediaRecorderRef.current.state === "recording") {
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
      const videoName = `${nameInput}-${String.fromCharCode(
        64 + videoIndex
      )}${videoIndex}`;
      formData.append("video", videoBlob, `${videoName}`);

      await axios.post("http://localhost:5050/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Video uploaded successfully");
      setVideoIndex((prevIndex) => prevIndex + 1);
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  const videoConstraints = {
    facingMode: "user",
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <div className="w-50">
        <div className="d-flex justify-content-center mb-4">
        <h1>Webcam Video Recorder</h1>
        </div>
        <div className="d-flex justify-content-center">
          <Webcam
            audio={false}
            width="100%"
            className="rounded shadow"
            videoConstraints={videoConstraints}
            ref={webcamRef}
          />
        </div>
        <div className="w-full d-flex justify-content-between">
          <div className="d-flex w-100 mt-3">
            <input
              type="text"
              class="form-control bg-body-secondary"
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Masukan Nama Lokasi"
            />
            {recording ? (
              <button
                type="button"
                class="btn btn-danger w-50 ms-2 shadow"
                onClick={stopRecording}
              >
                Stop Rekam
              </button>
            ) : (
              <button
                type="button"
                class="btn btn-primary w-50 ms-2 shadow"
                onClick={startRecording}
              >
                Mulai Rekam
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
