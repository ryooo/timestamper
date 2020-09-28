import { Controller } from "stimulus"
import 'tempusdominus-bootstrap-4';

export default class extends Controller {
  static targets = ['input', 'hiddenInput']

  initialize() {
    this.picker = $(this.element).daterangepicker({
      startDate: moment(this._$inputTarget.val()),
      singleDatePicker: true,
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
      isCustomDate: function(date) {
        return _.includes(holidays, date.format("YYYY-MM-DD")) ? "holiday" : false
      },
    }).data('daterangepicker')

    if (this._$inputTarget.val() != "") {
      this._updateInputsValue(moment(this._$inputTarget.val()))
    }

    $(this.element).on('apply.daterangepicker', event => {
      this._updateInputsValue(moment(this.picker.startDate.clone()))
    })
    this._$inputTarget.on('focusout', event => {
      let str = event.target.value
      let m = moment(str.replace(/\s+/g, "").split("(")[0])
      if (m.isValid()) {
        this._updateInputsValue(m)
        this.picker.startDate = m
        this.picker.endDate = m
        this.picker.hide()
      }
    })
  }

  _updateInputsValue(date) {
    date.locale("ja")
    this._$inputTarget.val(date.format("YYYY / M / D (dd)"))
    this._$hiddenInputTarget.val(date.format("YYYY-MM-DD"))
  }

  get _$inputTarget() {
    return $(this.inputTarget)
  }

  get _$hiddenInputTarget() {
    return $(this.hiddenInputTarget)
  }
}