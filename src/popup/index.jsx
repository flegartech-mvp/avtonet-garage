import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './styles/globals.css';

const root = createRoot(document.getElementById('root'));
// Bug 24 fix: wrap App in an ErrorBoundary so that a render-time exception
// (e.g. caused by corrupted vehicle data in storage) shows a recovery screen
// instead of a completely blank popup.
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
