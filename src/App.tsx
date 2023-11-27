import * as React from 'react';
import BandsProvider from './components/BandsProvider';
import Home from './components/Home'

function App() {
  return (
    <BandsProvider>
      <div>
        <Home />
      </div>

    </BandsProvider>
  );
}

export default App;