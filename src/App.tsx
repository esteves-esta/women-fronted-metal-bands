import * as React from 'react';
import BandsProvider from './components/BandsProvider';
import DeezerProvider from './components/DeezerProvider';
import Home from './components/Home'
import { Github } from 'lucide-react';

function App() {
  console.log('changes')
  const year = new Date().getFullYear()

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
    <BandsProvider>
      <DeezerProvider>
        <main className="mx-40 my-16">
          <Home />
        </main>

        <hr />
        <footer className='mx-40 py-20 flex flew-row justify-between'>
          <div className='flex flex-row gap-3'>
            <a href='https://github.com/esteves-esta/women-fronted-metal-bands' target='_blank'>
              <Github size={18} />

              <small>
                designed & developed by esteves-esta ©{' '}
                {year}
              </small>
            </a>
          </div>
          <small>
            built with: React / RadixUI / Vite / Tailwind / LucideIcons
          </small>
        </footer>
      </DeezerProvider>
    </BandsProvider>
  );
}

export default App;