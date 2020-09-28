import { Controller } from "stimulus"
import 'bootstrap-daterangepicker'
import { filter } from 'lodash'
import URI from 'urijs'

export default class extends Controller {
  static targets = ['picker', 'pickerText', 'termText']

  connect() {
    this.picker = $(this.pickerTarget).daterangepicker({
      startDate: this._targetDate,
      endDate: this._termEndDate,
      singleDatePicker: this._limit == 1,
      dateLimit: this._limit && {days: this._limit} || null,
      autoApply: true,
      locale: {
        applyLabel: '選択',
        cancelLabel: 'クリア',
        fromLabel: '開始日',
        toLabel: '終了日',
        weekLabel: 'W',
        customRangeLabel: '自分で指定',
        daysOfWeek: moment.weekdaysMin(),
        monthNames: moment.monthsShort(),
        firstDay: moment.localeData()._week.dow
      }, 
      alwaysShowCalendars: true,
      opens: 'center',
    }).data('daterangepicker')
    window.aaa = this.picker

    this._setPickerText()
    this._setTermText()
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

  _setPickerText() {
    if (!this.hasPickerTextTarget) { return }
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

  termWeek() {
    this.term = "week"
    this._setTermText()
  }

  termMonth() {
    this.term = "month"
    this._setTermText()
  }

  termCustom() {
    this.term = "custom"
    this._setTermText()
  }

  _setTermText() {
    if (!this.hasTermTextTarget) { return }
    let text = null
    if (this._term == 'day') {
      text = "日単位"
      this.picker.singleDatePicker = true
    } else if (this._term == 'week') {
      text = "週単位"
      this.picker.singleDatePicker = true
    } else if (this._term == 'month') {
      text = "月単位"
      this.picker.singleDatePicker = true
    } else {
      text = "自由な日付範囲"
      this.picker.singleDatePicker = false
    }
    this.picker.maxSpan = {days: this._limit}
    $(this.termTextTarget).text(text)
  }

  get _term() {
    if (this.term) return this.term
    return current.dateRange.term
  }

  get _termStartDate() {
    return moment(current.dateRange.term_start_date)
  }

  get _termEndDate() {
    return moment(current.dateRange.term_end_date)
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
    let href = ""
    if (this._term == "custom") {
      href = uri.setQuery({
        start_date: moment().format('YYYY-MM-DD'),
        end_date: moment().add(this._termEndDate.diff(this._termStartDate, 'day'), 'day').format('YYYY-MM-DD'),
        target_date: moment().format('YYYY-MM-DD')
      }).href()
    } else {
      href = uri.setQuery({
        start_date: moment().startOf(this._term).format('YYYY-MM-DD'),
        end_date: moment().endOf(this._term).format('YYYY-MM-DD'),
        target_date: moment().format('YYYY-MM-DD')
      }).href()
    }
    $(this.picker.container).prepend(`<div class='today-header'><a href='${href}' class='today'>本日へ</a></div>`)
  }

  _applyPicker() {
    if (this._term == "custom") {
      let startDate = this.picker.startDate.clone()
      this._reload(
        startDate,
        this.picker.endDate.clone(),
        startDate
      )
    } else {
      let pickedDate = this.picker.startDate.clone()
      let startDate = this.picker.startDate.clone().startOf(this._term)
      this._reload(startDate, startDate.clone().endOf(this._term), pickedDate)
    }
  }

  _reload(startDate, endDate, pickedDate) {
    const uri = new URI(window.location)
    uri.setQuery({start_date: startDate.format('YYYY-MM-DD'), end_date: endDate.format('YYYY-MM-DD')})
    if (pickedDate) uri.setQuery({target_date: pickedDate.format('YYYY-MM-DD')})
    if (this.term) uri.setQuery({term: this.term})
    Turbolinks.visit(uri.href())
  }

  _setPickerText() {
    if (!this.hasPickerTextTarget) {
      return
    }
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
    let step = add ? 1 : -1
    if (this._term == "custom") {
      step *= (this._termEndDate.diff(this._termStartDate, 'day') + 1)
      let startDate = this._termStartDate.clone().add(step, 'days')
      this._reload(startDate, this._termEndDate.clone().add(step, 'days'), startDate)
    } else {
      let startDate = this._termStartDate.clone().add(step, this._term).startOf(this._term)
      this._reload(startDate, startDate.clone().endOf(this._term), startDate)
    }
  }

  _toggleShowClass(toggle) {
    $(this.picker.container).toggleClass('show', toggle)
  }

  get _targetDate() {
    return moment(current.dateRange.target_date)
  }


  get _startDate() {
    return moment(current.dateRange.start_date)
  }

  get _endDate() {
    return moment(current.dateRange.end_date)
  }

  get _limit() {
    if (this._term == "custom") {
      return 31
    }
    return 1
  }
}