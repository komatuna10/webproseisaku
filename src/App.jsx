import React, { useState, useEffect } from "react";
import CameraCapture from "./CameraCapture"; // カメラ機能のコンポーネント

const App = ({ user }) => {
  const [folders, setFolders] = useState(
    JSON.parse(localStorage.getItem(`${user}_folders`)) || []
  );
  const [folderName, setFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [diary, setDiary] = useState({ photo: "", name: "", review: "", rating: 3 });
  const [isCameraMode, setIsCameraMode] = useState(false); // カメラモード管理

  useEffect(() => {
    return () => {
      if (diary.photo) {
        URL.revokeObjectURL(diary.photo); // メモリリークを防ぐ
      }
    };
  }, [diary.photo]);

  const saveFolders = (updatedFolders) => {
    setFolders(updatedFolders);
    localStorage.setItem(`${user}_folders`, JSON.stringify(updatedFolders));
  };

  const addFolder = () => {
    if (folderName.trim()) {
      const updatedFolders = [...folders, { name: folderName, entries: [] }];
      saveFolders(updatedFolders);
      setFolderName("");
    } else {
      alert("フォルダ名を入力してください！");
    }
  };

  const addDiaryEntry = () => {
    if (selectedFolder && diary.name && diary.review) {
      const updatedFolders = folders.map((folder) =>
        folder.name === selectedFolder.name
          ? { ...folder, entries: [...folder.entries, { ...diary }] }
          : folder
      );
      saveFolders(updatedFolders);
      setDiary({ photo: "", name: "", review: "", rating: 3 });
    } else {
      alert("すべての項目を入力してください！");
    }
  };

  const deleteDiaryEntry = (index) => {
    if (window.confirm("本当にこの日記を削除しますか？")) {
      const updatedFolders = folders.map((folder) =>
        folder.name === selectedFolder.name
          ? {
              ...folder,
              entries: folder.entries.filter((_, entryIndex) => entryIndex !== index),
            }
          : folder
      );
      saveFolders(updatedFolders); // ローカルストレージに保存
      setSelectedFolder(
        updatedFolders.find((folder) => folder.name === selectedFolder.name) || null
      ); // 選択中のフォルダを更新
    }
  };

  const deleteFolder = (folderName) => {
    if (window.confirm(`フォルダ「${folderName}」を削除しますか？`)) {
      const updatedFolders = folders.filter((folder) => folder.name !== folderName);
      saveFolders(updatedFolders);
      if (selectedFolder && selectedFolder.name === folderName) {
        setSelectedFolder(null); // 現在選択中のフォルダが削除された場合、選択を解除
      }
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setDiary({ ...diary, photo: base64 });
    }
  };

  const handleCapture = (photo) => {
    setDiary({ ...diary, photo });
    setIsCameraMode(false); // カメラモードを終了
  };

  return (
    <div>
      <header>{user}さんの食べ日記</header>
      <div className="container">
        <h2>フォルダ作成</h2>
        <input
          type="text"
          placeholder="フォルダ名"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
        <button onClick={addFolder}>追加</button>

        <h2>フォルダ一覧</h2>
        <ul className="folder-list">
          {folders.map((folder) => (
            <li key={folder.name} className="folder-item">
              <span onClick={() => setSelectedFolder(folder)}>{folder.name}</span>
              <button onClick={() => deleteFolder(folder.name)}>削除</button>
            </li>
          ))}
        </ul>

        {selectedFolder && (
          <>
            <h2>{selectedFolder.name} - 日記追加</h2>
            <div className="diary-form">
              {/* 画像プレビュー */}
              {diary.photo && <img src={diary.photo} alt="写真プレビュー" style={{ width: "100px" }} />}

              {/* 写真選択 & カメラ撮影 */}
              <input type="file" accept="image/*" onChange={handlePhotoUpload} />
              <button onClick={() => setIsCameraMode(!isCameraMode)}>
                {isCameraMode ? "カメラを閉じる" : "カメラで撮影"}
              </button>

              {/* カメラモードの切り替え */}
              {isCameraMode && <CameraCapture onCapture={handleCapture} />}

              <input
                type="text"
                placeholder="お店の名前"
                value={diary.name}
                onChange={(e) => setDiary({ ...diary, name: e.target.value })}
              />
              <textarea
                placeholder="感想"
                value={diary.review}
                onChange={(e) => setDiary({ ...diary, review: e.target.value })}
              />
              <select
                value={diary.rating}
                onChange={(e) => setDiary({ ...diary, rating: e.target.value })}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} 星
                  </option>
                ))}
              </select>
              <button onClick={addDiaryEntry}>日記を追加</button>
            </div>

            <h2>日記一覧</h2>
            <ul className="folder-list">
              {selectedFolder.entries.map((entry, index) => (
                <li key={index} className="folder-item">
                  {entry.photo && (
                    <img
                      src={entry.photo}
                      alt="写真"
                      style={{ width: "100px", height: "auto", objectFit: "cover" }}
                    />
                  )}
                  <p>お店の名前: {entry.name}</p>
                  <p>感想: {entry.review}</p>
                  <p>評価: {entry.rating} 星</p>
                  <button onClick={() => deleteDiaryEntry(index)}>削除</button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export default App;
