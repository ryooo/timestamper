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
      return this._overlapsRange(moment(date).startOf('day'), moment(date).endOf('day'))
    } else {
      return this.date == date
    } 
  }

  setDate(date) {
    date = moment(date)
    let dateAttrs = {year: date.year(), month: date.month(), date: date.date()}
    let inAt = this.inAt.clone().set(dateAttrs)
    let outAt = this.outAt.clone().set(dateAttrs)
    if (inAt.isAfter(outAt)) outAt.add(1, 'day')
    this.attributes.in_at = inAt.toISOString()
    this.attributes.out_at = outAt.toISOString()
    this.orderAttributes.timeframe = [inAt.unix(), outAt.unix()]
  }

  @computed get date() {
    if (this.hasAllDayAttribute) return null
    return this.inAt.format('YYYY-MM-DD')
  }

  @computed get outAt() {
    return moment(this.attributes.out_at) 
  }

  @computed get inFuture() {
    return momentLocalAsUTC.isBefore(this.hasAllDayAttribute ? this.outAt : this.inAt)
  }

  @computed get isTimeframeFiltered() {
    let rangeStart = moment(current.dateRange.padded_start_date).startOf('day')
    let rangeEnd = moment(current.dateRange.padded_end_date).endOf('day')
    return this.inRange(rangeStart, rangeEnd)
  }

  @computed get inAt() {
    return moment(this.attributes.in_at) 
  }

  get hasAllDayAttribute() {
    return this.attributes.all_day != undefined 
  }

  get dayStylesString() {
    return "margin-left: " + this._dayMargin(this.attributes.in_at, moment(this.attributes.in_on).startOf('day').add(4, 'hours')) + ";" + 
      "margin-right: " + this._dayMargin(moment(this.attributes.in_on).endOf('day').add(4, 'hours'), this.attributes.out_at) + ";"
  }

// PRIVATE 

  _overlapsRange(rangeStart, rangeEnd) {
    return this.outAt >= rangeStart && this.inAt <= rangeEnd
  }

  _dayMargin(leftTimestamp, rightTimestamp) {
    if (rightTimestamp == undefined) {
      rightTimestamp = moment.now()
    }
    return `${max([0, (moment(leftTimestamp).unix() - moment(rightTimestamp).unix())]) / 864}%`
  }

  _startsBetweenRange(rangeStart, rangeEnd) {
    return this.inAt.isBetween(rangeStart, rangeEnd, null, '[]')
  }
}

export default timeframeModelConcern