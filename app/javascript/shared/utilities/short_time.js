export function shortTime(datetime) {
  return moment(datetime).format('H:mm')
}

export function shortTimeSpan(startAt, endAt) {
  return `${shortTime(startAt)} - ${endAt ? shortTime(endAt) : '?'}`
}
