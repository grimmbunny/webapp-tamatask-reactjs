import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Importa a sua folha de estilo global para que as classes
// CSS fiquem disponíveis em toda a aplicação.
import "./styles.css"; //

// Pega o elemento com id 'root' no index.html e renderiza
// o componente App dentro dele.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
