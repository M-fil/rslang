export default function dateFormat(day, month, year) {
  const m = (month < 10) ? `0${month}` : month;
  const d = (day < 10) ? `0${day}` : day;
  return `${d}.${m}.${year}`;
}
