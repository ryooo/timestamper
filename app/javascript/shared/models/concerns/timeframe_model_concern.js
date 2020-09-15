import { computed } from 'mobx'
import { max } from 'lodash'

const timeframeModelConcern = (superclass) => class extends superclass {  
  inRange(rangeStart, rangeEnd) {
    if (this.hasAllDayAttribute) {
      return this._overlapsRange(rangeStart, rangeEnd)
    } else {
      return this._startsBetweenRange(rangeStart, rangeEnd)
    } 
  }

  onDate(date) {
    if (this.hasAllDayAttribute) {
      return this._overlapsRange(momentUTC(date).startOf('day'), momentUTC(date).endOf('day'))
    } else {
      return this.date == date
    } 
  }

  setDate(date) {
    date = momentUTC(date)
    let dateAttrs = {year: date.year(), month: date.month(), date: date.date()}
    let startAt = this.startAt.clone().set(dateAttrs)
    let endAt = this.endAt.clone().set(dateAttrs)
    if (startAt.isAfter(endAt)) endAt.add(1, 'day')
    this.attributes.start_at = startAt.toISOString()
    this.attributes.end_at = endAt.toISOString()
    this.orderAttributes.timeframe = [startAt.unix(), endAt.unix()]
  }

  @computed get date() {
    if (this.hasAllDayAttribute) return null
    return this.startAt.format('YYYY-MM-DD')
  }

  @computed get endAt() {
    return momentUTC(this.attributes.end_at) 
  }

  @computed get inFuture() {
    return momentLocalAsUTC.isBefore(this.hasAllDayAttribute ? this.endAt : this.startAt)
  }

  @computed get isTimeframeFiltered() {
    let rangeStart = momentUTC(current.dateRange.padded_start_date).startOf('day')
    let rangeEnd = momentUTC(current.dateRange.padded_end_date).endOf('day')
    return this.inRange(rangeStart, rangeEnd)
  }

  @computed get startAt() {
    return momentUTC(this.attributes.start_at) 
  }

  get hasAllDayAttribute() {
    return this.attributes.all_day != undefined 
  }

  get dayStyles() {
    if (current.dateRange.interval != 'day' || this.attributes.all_day) return null
    return {
      marginLeft: this._dayMargin(this.attributes.start_at, current.dateRange.start_date),
      marginRight: this._dayMargin(momentUTC(current.dateRange.start_date).add(1, 'day'), this.attributes.end_at)
    }
  }

  _overlapsRange(rangeStart, rangeEnd) {
    return this.endAt >= rangeStart && this.startAt <= rangeEnd
  }

  _dayMargin(leftTimestamp, rightTimestamp) {
    return `${max([0, (momentUTC(leftTimestamp).unix() - momentUTC(rightTimestamp).unix())]) / 864}%`
  }

  _startsBetweenRange(rangeStart, rangeEnd) {
    return this.startAt.isBetween(rangeStart, rangeEnd, null, '[]')
  }
}

export default timeframeModelConcern