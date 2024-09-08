import * as React from "react";
import BandsProvider from "./components/BandsProvider";
import DeezerProvider from "./components/DeezerProvider";
import ToastProvider from "./components/ToastProvider";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import GlobalStyles from "./GlobalStyles";
import { Github } from "lucide-react";

function App() {
  React.useEffect(() => {
    function handleKeyDown(event) {
      // prevent scrolling when clicking on spacebar
      if (
        event.code === "Space" &&
        (event.target == document.body || event.target.nodeName == "BUTTON")
      ) {
        event.preventDefault();
        return false;
      }
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const year = new Date().getFullYear();

  return (
    <ToastProvider>
      <BandsProvider>
        <DeezerProvider>
          <Header />

          <Outlet />

          <footer>
            <div>
              <a
                href="https://github.com/esteves-esta/women-fronted-metal-bands"
                target="_blank"
              >
                <Github size={18} />
                <small>designed & developed by esteves-esta © {year}</small>
              </a>
            </div>
            <small>built with: React / RadixUI / Vite / LucideIcons</small>
          </footer>

          <GlobalStyles />
        </DeezerProvider>
      </BandsProvider>
    </ToastProvider>
  );
}

export default App;
