import './style.css';
import { App } from './components/app';

const app = new App();
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
