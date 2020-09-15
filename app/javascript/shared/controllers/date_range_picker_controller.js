import { Controller } from "stimulus"
import 'bootstrap-daterangepicker'
import { filter } from 'lodash'
import URI from 'urijs'

export default class extends Controller {
  static targets = ['picker', 'pickerText', 'today']

  connect() {
    this.picker = $(this.pickerTarget).daterangepicker({
      startDate: this._limit && this._termStartDate || this._targetDate,
      endDate: this._termEndDate,
      singleDatePicker: true,
      dateLimit: this._limit && {days: this._limit} || null,
      autoApply: true,
      locale: {format: 'YYYY年M月D日'}, 
      alwaysShowCalendars: true,
      opens: 'center',
    }).data('daterangepicker')

    this._setText()
    this._addTodayHeader()

    $(this.pickerTarget).on('apply.daterangepicker', event => { 
      this._applyPicker() 
    })

    $(this.pickerTarget).on('show.daterangepicker', event => {
      this._toggleShowClass(true)
    })

    $(this.pickerTarget).on('hide.daterangepicker', event => { 
      this._toggleShowClass(false)
    })

    $(this.picker.container).on('click', event => {
      if ($(event.target).is(this.picker.container) || $(event.target).hasClass('today')) {
        this.picker.hide()
      }
    })
  }

  next() {
    this._shiftRange(true)
  }

  previous() {  
    this._shiftRange(false)
  }

  _addTodayHeader() {
    const uri = new URI(window.location)
    let term = this._term && this._term || 'month'
    const href = uri.setQuery({
      start_date: moment().startOf(term).format('YYYY-MM-DD'),
      end_date: moment().endOf(term).format('YYYY-MM-DD'),
      target_date: moment().format('YYYY-MM-DD')
    }).href()
    $(this.picker.container).prepend(`<div class='today-header'><a href='${href}' class='today'>本日へ</a></div>`)
  }

  _applyPicker() {
    if (this._term) {
      let pickedDate = this.picker.startDate.clone()
      let startDate = this.picker.startDate.clone().startOf(this._term)
      this._reload(startDate, startDate.clone().endOf(this._term), pickedDate)
    } else {
      this._reload(this.picker.startDate.clone(), this.picker.endDate.clone())
    }
  }

  _reload(startDate, endDate, pickedDate) {
    const uri = new URI(window.location)
    uri.setQuery({start_date: startDate.format('YYYY-MM-DD'), end_date: endDate.format('YYYY-MM-DD')})
    if (pickedDate) uri.setQuery({target_date: pickedDate.format('YYYY-MM-DD')})
    Turbolinks.visit(uri.href())
  }

  _setText() {
    let text = null
    if (this._term == 'day') {
      text = this._termStartDate.format('YYYY年M月D日(dd)')
    } else if (this._term == 'month') {
      text = this._termStartDate.format('YYYY年M月')
    } else {
      text = `${this._termStartDate.format('YYYY年M月D日(dd)')} - ${this._termEndDate.format('M月D日(dd)')}`
    }
    $(this.pickerTextTarget).text(text)
  }

  _shiftRange(add) {
    let step = this._term ? 1 : (this._termEndDate.diff(this._termStartDate, 'day') + 1)
    step = add ? step : -step
    if (this._term) {
      let startDate = this._termStartDate.clone().add(step, this._term).startOf(this._term)
      this._reload(startDate, startDate.clone().endOf(this._term), startDate)
    } else {
      this._reload(this._termStartDate.clone().add(step, 'days'), this._termEndDate.clone().add(step, 'days'), startDate)
    }
  }

  _toggleShowClass(toggle) {
    $(this.picker.container).toggleClass('show', toggle)
  }

  get _targetDate() {
    return moment(current.dateRange.target_date)
  }

  get _termStartDate() {
    return moment(current.dateRange.term_start_date)
  }

  get _termEndDate() {
    return moment(current.dateRange.term_end_date)
  }

  get _startDate() {
    return moment(current.dateRange.start_date)
  }

  get _endDate() {
    return moment(current.dateRange.end_date)
  }

  get _term() {
    return current.dateRange.term
  }

  get _limit() {
    return current.dateRange.limit
  }
}