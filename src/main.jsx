import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import Login from "./Login";
import App from "./App";

const Main = () => {
  const [user, setUser] = useState(null);

  return user ? <App user={user} /> : <Login onLogin={setUser} />;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Main />);
