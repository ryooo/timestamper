import { Controller } from "stimulus"
import 'tempusdominus-bootstrap-4';

export default class extends Controller {
  id = null
  input = null

  initialize() {
    this.id = 'time-field-' + _.random(0, 1000000)
    jQuery(this.element).attr('id', this.id).attr("data-target-input", "nearest");
    this.input = jQuery(this.element).find("> input")
    this.input.data("target", "#" + this.id)
    this.input.addClass("datetimepicker-input")
    this.input.attr("data-toggle", "datetimepicker")

    jQuery("#" + this.id).datetimepicker({
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
  }
}