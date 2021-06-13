import moment from 'moment';

export const loadingUrl = 'https://ahj-12-2.herokuapp.com/news/slow';
export const dataUrl = 'https://ahj-12-2.herokuapp.com/news';
export const imagesUrl = 'https://ahj-12-2.herokuapp.com/images/';

export function getISODateTime(datetime) {
  return moment(datetime).format('YYYY-MM-DDTHH:mm');
}

export function getTextDateTime(datetime) {
  return moment(datetime).format('HH:mm DD.MM.YYYY');
}
