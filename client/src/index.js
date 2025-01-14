import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './services/authContext';

import App from './App';

const rootElement = document.getElementById('root');

// Use ReactDOM.createRoot consistently
const reactRoot = ReactDOM.createRoot(rootElement);

// Render your app inside the created root
reactRoot.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
