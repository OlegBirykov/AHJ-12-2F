import {
  loadingUrl, dataUrl, imagesUrl, getISODateTime, getTextDateTime,
} from './tools';

export default class NewsWidget {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.classes = this.constructor.classes;
  }

  static get classes() {
    return {
      widget: 'news-widget',
      header: 'header',
      title: 'title',
      uploadLink: 'upload-link',
      news: 'news',
      new: 'new',
      datetime: 'datetime',
      newContainer: 'new-container',
      newImageContainer: 'new-image-container',
      newImage: 'new-image',
      newTextContainer: 'new-text-container',
      newText: 'new-text',
      errorContainer: 'error-container',
      errorText: 'error-text',
    };
  }

  static get markup() {
    return `
      <div class="${this.classes.header}">
        <h1 class="${this.classes.title}">
          Новости мира кино
        </h1>
        <a class="${this.classes.uploadLink}" href=".">
          Обновить
        </a>
      </div>
      <div class="${this.classes.news}">
      </div>
      <div class="${this.classes.errorContainer} hidden">
        <p class="${this.classes.errorText}">
          Не удалось загрузить данные
        </p>
        <p class="${this.classes.errorText}">
          Проверьте подключение и обновите страницу
        </p>
      </div>
    `;
  }

  bindToDOM() {
    this.widget = document.createElement('div');
    this.widget.className = this.classes.widget;
    this.widget.innerHTML = this.constructor.markup;

    this.uploadLink = this.widget.querySelector(`.${this.classes.uploadLink}`);
    this.news = this.widget.querySelector(`.${this.classes.news}`);
    this.error = this.widget.querySelector(`.${this.classes.errorContainer}`);

    this.uploadLink.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.requestNews();
    });

    this.parentEl.append(this.widget);

    navigator.serviceWorker.addEventListener('message', async (evt) => {
      if (evt.data === 'ready') {
        this.hideError();
        const response = await fetch(dataUrl);
        this.redrawNews(await response.json(), false);
      } else {
        this.showError();
      }
    });

    this.requestNews();
  }

  async requestNews() {
    this.hideError();
    const response = await fetch(loadingUrl);
    this.redrawNews(await response.json(), true);
  }

  redrawNews(news, isLoading) {
    const newContent = news.reduce((html, item) => `${html}
      <div class="${this.classes.new}">
        <time class="${this.classes.datetime}" datetime="${getISODateTime(item.timestamp)}">
          ${getTextDateTime(item.timestamp)}
        </time>
        <div class="${this.classes.newContainer}">
          <div class="${this.classes.newImageContainer}">
            <img class="${this.classes.newImage}" src="${imagesUrl}${item.image}" alt="new" width="50" height="50">
          </div>
          <div class="${this.classes.newTextContainer}">
            <span class="${this.classes.newText}">${item.text}</span>
          </p>
        </div>
      </div>
    `, '');

    if (isLoading) {
      this.news.classList.add('loading');
    } else {
      this.news.classList.remove('loading');
    }
    this.news.innerHTML = newContent;
  }

  showError() {
    this.error.classList.remove('hidden');
  }

  hideError() {
    this.error.classList.add('hidden');
  }
}
