import * as React from 'react';
import BandsProvider from './components/BandsProvider';
import Home from './components/Home'
import { Github } from 'lucide-react';

function App() {
  const year = new Date().getFullYear()
  return (
    <BandsProvider>
      <main className="mx-40 my-16">
        <Home />
      </main>

      <hr />
      <footer className='mx-40 py-20 flex flew-row justify-between'>
        <div className='flex flex-row gap-3'>
          <a href='https://github.com/esteves-esta/women-fronted-metal-bands' target='_blank'>
            <Github size={18} />
          </a>

          <small>
            designed & developed by esteves-esta ©{' '}
            {year}
          </small>
        </div>
        <small>
          built with: React / RadixUI / Parcel / Tailwind / LucideIcons
        </small>
      </footer>

    </BandsProvider>
  );
}

export default App;