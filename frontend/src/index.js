import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './ErrorBoundary'; // Import ErrorBoundary
import reportWebVitals from './reportWebVitals';
import { StateProvider } from './StateContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <StateProvider>
      <App />
    </StateProvider>
  </ErrorBoundary>
);

reportWebVitals();
