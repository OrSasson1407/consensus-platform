import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import WebShell from './web-shell.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WebShell />
  </StrictMode>,
);
