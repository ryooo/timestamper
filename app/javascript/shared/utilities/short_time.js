export function shortTime(datetime) {
  return momentUTC(datetime).format('H:mm')
}

export function shortTimeSpan(startAt, endAt) {
  return `${shortTime(startAt)} - ${endAt ? shortTime(endAt) : '?'}`
}