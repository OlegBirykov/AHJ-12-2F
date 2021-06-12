import NewsWidget from './NewsWidget';

const newsServer = 'https://ahj-12-2.herokuapp.com';

const news = new NewsWidget(document.getElementById('container'), newsServer);
news.bindToDOM();
