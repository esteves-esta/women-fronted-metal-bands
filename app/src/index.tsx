import { createRoot } from "react-dom/client";
import App from "./App";
import './reset.css';
import './styles.scss';

const container = document.getElementById("app");
const root = createRoot(container)
root.render(<App />);