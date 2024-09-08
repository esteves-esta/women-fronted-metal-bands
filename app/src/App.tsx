import * as React from "react";
import BandsProvider from "./components/BandsProvider";
import DeezerProvider from "./components/DeezerProvider";
import ToastProvider from "./components/ToastProvider";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import GlobalStyles from "./GlobalStyles";
import Footer from "./components/Footer";

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

  return (
    <ToastProvider>
      <BandsProvider>
        <DeezerProvider>
          <Header />

          <Outlet />

          <Footer />

          <GlobalStyles />
        </DeezerProvider>
      </BandsProvider>
    </ToastProvider>
  );
}

export default App;
