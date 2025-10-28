import { createRoot } from "react-dom/client";
import React from "react";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { BeerListProvider } from "./context/BeerListContext";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BeerListProvider>
        <App />
      </BeerListProvider>
    </AuthProvider>
  </React.StrictMode>
);
