import { floor, round } from 'lodash'

export function durationDisplay(duration) {
  if (current.setting('duration_decimal_format')) {
    return `${round(duration / 3600, 2)} 時間`
  } else {
    const hours = floor(duration / 3600)
    const minutes = round((duration - (hours * 3600)) / 60)
    return `${hours}時間 ${minutes}分`
  }
}

