import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />,
);

if ('serviceWorker' in navigator) {
  // navigator.serviceWorker.register('/sw.js', { scope: '/' });
  navigator.serviceWorker.register('/sw.js');
}