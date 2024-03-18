import * as React from 'react';
import BandsProvider from './components/BandsProvider';
import DeezerProvider from './components/DeezerProvider';
import ToastProvider from './components/ToastProvider';
import MainPage from './components/MainPage';

function App() {
  React.useEffect(() => {
    function handleKeyDown(event) {
      // prevent scrolling when clicking on spacebar
      if (event.code === 'Space' && (event.target == document.body || event.target.nodeName == 'BUTTON')) {
        event.preventDefault();
        return false;
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [])

  return (
    <ToastProvider>
      <BandsProvider>
        <DeezerProvider>

          <MainPage />

        </DeezerProvider>
      </BandsProvider>
    </ToastProvider>
  );
}

export default App;