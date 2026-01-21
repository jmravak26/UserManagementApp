import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from '../src/store';
import { DatabaseModeProvider } from './contexts/DatabaseModeContext';
import './index.css';
import './App.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <DatabaseModeProvider>
          <App />
        </DatabaseModeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
