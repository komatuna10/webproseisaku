import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[username] && users[username] === password) {
      onLogin(username);
    } else {
      alert("ユーザー名またはパスワードが正しくありません。");
    }
  };

  const handleRegister = () => {
    const users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[username]) {
      alert("このユーザー名は既に使用されています。");
    } else {
      users[username] = password;
      localStorage.setItem("users", JSON.stringify(users));
      alert("登録が完了しました！");
      setIsRegistering(false);
    }
  };

  return (
    <div>
      <h1>食べ日記</h1>
      <h2>{isRegistering ? "新規登録" : "ログイン"}</h2>
      <input
        type="text"
        placeholder="ユーザー名"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {isRegistering ? (
        <button onClick={handleRegister}>登録</button>
      ) : (
        <button onClick={handleLogin}>ログイン</button>
      )}
      <button onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? "ログイン画面へ" : "新規登録画面へ"}
      </button>
    </div>
  );
};

export default Login;