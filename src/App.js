import React, { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to React!</h1>
        <p>This is a basic React application.</p>
        
        <div className="counter-section">
          <p>You clicked {count} times</p>
          <button 
            className="counter-button"
            onClick={() => setCount(count + 1)}
          >
            Click me
          </button>
          <button 
            className="reset-button"
            onClick={() => setCount(0)}
          >
            Reset
          </button>
        </div>

        <div className="info-section">
          <h2>Getting Started</h2>
          <p>Edit <code>src/App.js</code> and save to reload.</p>
          <p>
            Learn React by visiting the{' '}
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              React documentation
            </a>
          </p>
        </div>
      </header>
    </div>
  );
}

export default App;
