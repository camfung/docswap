import dayjs from 'dayjs';

export function formatDateFromString(
  date: string,
  format: string = 'DD MMM, YYYY'
): string {
  const dateObj = new Date(date);
  return formatDate(dateObj, format);
}

export function formatDate(
  date?: Date,
  format: string = 'DD MMM, YYYY'
): string {
  if (!date) return '';
  return dayjs(date).format(format);
}
