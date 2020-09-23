import { Controller } from "stimulus"
import 'tempusdominus-bootstrap-4';

export default class extends Controller {
  static targets = ['input', 'hiddenInput']

  initialize() {

    jQuery("#datetimepicker_inAt").datetimepicker({
        tooltips: {
            close: '閉じる',
            pickHour: '時間を取得',
            incrementHour: '時間を増加',
            decrementHour: '時間を減少',
            pickMinute: '分を取得',
            incrementMinute: '分を増加',
            decrementMinute: '分を減少',
            pickSecond: '秒を取得',
            incrementSecond: '秒を増加',
            decrementSecond: '秒を減少',
            togglePeriod: '午前/午後切替',
            selectTime: '時間を選択'
        },
        format: 'HH:mm',
        locale: 'ja',
        buttons: {
            showClose: true
        }
    });
    this.updateInputs()

    $(this.inputTarget).on('apply.datetimepicker', event => {
      this.updateInputs(true)
    })

    // $(this.timePicker.container).on('click', event => {
    //   if ($(event.target).is(this.timePicker.container)) this.timePicker.hide()
    // })
  }

  updateInputs(triggerChangeEvent = false) {
    this.inputTarget.value = this.initialTime.format('HH:mm')
    this.hiddenInputTarget.value = this.initialTime.format('HH:mm')
    if (triggerChangeEvent) this.hiddenInputTarget.dispatchEvent(new Event('change'))
  }

  get initialTime() {
    const time = moment(this.hiddenInputTarget.value, 'HH:mm')
    return time.isValid() && time || moment()
  }
}