import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add fonts
const montserrat = document.createElement("link");
montserrat.rel = "stylesheet";
montserrat.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap";
document.head.appendChild(montserrat);

const openSans = document.createElement("link");
openSans.rel = "stylesheet";
openSans.href = "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600&display=swap";
document.head.appendChild(openSans);

createRoot(document.getElementById("root")!).render(<App />);
