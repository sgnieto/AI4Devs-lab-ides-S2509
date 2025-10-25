import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from './components/ui/button';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 12, alignItems: 'center' }}>
          <AcademicCapIcon className="w-6 h-6 text-slate-500" />
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
        </div>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
