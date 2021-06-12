import moment from 'moment';

export function getISODateTime(datetime) {
  return moment(datetime).format('YYYY-MM-DDTHH:mm');
}

export function getTextDateTime(datetime) {
  return moment(datetime).format('HH:mm DD.MM.YYYY');
}
