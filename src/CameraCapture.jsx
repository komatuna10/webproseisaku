import React, { useRef } from "react";

const CameraCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    videoRef.current.play();
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photo = canvas.toDataURL("image/png");
    onCapture(photo);
    stopCamera();
  };

  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
  };

  return (
    <div>
      <video ref={videoRef} autoPlay style={{ width: "100%" }}></video>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      <button onClick={startCamera}>カメラ開始</button>
      <button onClick={capturePhoto}>写真を撮る</button>
      <button onClick={stopCamera}>カメラを停止</button>
    </div>
  );
};

export default CameraCapture;

