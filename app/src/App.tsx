import * as React from "react";
import BandsProvider from "./components/BandsProvider";
import DeezerProvider from "./components/DeezerProvider";
import ToastProvider from "./components/ToastProvider";
import { Outlet, NavLink } from "react-router-dom";
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
          <header>
            <nav>
              <ul>
                <li>
                  <NavLink to="/">Bands</NavLink>
                </li>
                <li>
                  <NavLink to="/table">table view</NavLink>
                </li>
                <li>
                  <NavLink to="/graphs">graphs</NavLink>
                </li>
                <li>
                  <NavLink to="/about">About</NavLink>
                </li>
              </ul>
            </nav>

            <div>
              <h1>
                Women Fronted <span>metal bands</span>
              </h1>
              <p>
                This is a project to compile a list of metal bands that have
                women as lead vocalists.
              </p>
            </div>
          </header>

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
