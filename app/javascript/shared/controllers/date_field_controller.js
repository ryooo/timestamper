import { Controller } from "stimulus"
import "bootstrap-daterangepicker"

export default class extends Controller {
  static targets = ['input', 'hiddenInput']

  initialize() {
    this.datePicker = $(this.inputTarget).daterangepicker({
      startDate: this.initialDate,
      singleDatePicker: true,
      autoApply: true,
      autoUpdateInput: false,
      locale: {format: 'YYYY/M/D'}, 
      alwaysShowCalendars: true
    }).data('daterangepicker')
    this.updateInputs()

    $(this.inputTarget).on('apply.daterangepicker', event => {
      this.updateInputs(true)
    })

    $(this.datePicker.container).on('click', event => {
      if ($(event.target).is(this.datePicker.container)) this.datePicker.hide()
    })
  }

  updateInputs(triggerChangeEvent = false) {
    this.inputTarget.value = this.datePicker.startDate.format('YYYY/M/D')
    this.hiddenInputTarget.value = this.datePicker.startDate.format('YYYY-MM-DD')
    if (triggerChangeEvent) this.hiddenInputTarget.dispatchEvent(new Event('change'))
  }

  get initialDate() {
    const date = moment(this.hiddenInputTarget.value, 'YYYY-MM-DD')
    return date.isValid() && date || moment()
  }
}