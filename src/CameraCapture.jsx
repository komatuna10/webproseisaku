import React, { useState } from "react";

const CameraCapture = ({ onCapture }) => {
  const [hasMedia, setHasMedia] = useState(false);
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  // カメラを起動する関数
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setHasMedia(true);
    } catch (err) {
      console.error("カメラを起動できませんでした: ", err);
    }
  };

  // 写真を撮る関数
  const capturePhoto = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, 320, 240); // ビデオの内容をキャンバスに描画
    const photo = canvasRef.current.toDataURL("image/png"); // Base64 エンコードされた写真を取得
    onCapture(photo); // 親コンポーネントに写真を渡す
  };

  return (
    <div>
      <button onClick={startCamera}>カメラを起動</button>
      {hasMedia && (
        <>
          <video ref={videoRef} autoPlay style={{ width: "320px", height: "240px" }} />
          <canvas ref={canvasRef} style={{ display: "none" }} width={320} height={240}></canvas>
          <button onClick={capturePhoto}>写真を撮る</button>
        </>
      )}
    </div>
  );
};

export default CameraCapture;
