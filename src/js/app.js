import NewsWidget from './NewsWidget';

const isSWActive = navigator.serviceWorker.controller;

(async () => {
  await navigator.serviceWorker.register('./service.worker.js');
})();

if (!isSWActive) {
  window.location.reload();
}

const news = new NewsWidget(document.getElementById('container'));
news.bindToDOM();
