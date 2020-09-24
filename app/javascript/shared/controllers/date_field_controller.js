import { Controller } from "stimulus"
import 'tempusdominus-bootstrap-4';

export default class extends Controller {
  id = null
  input = null
  hiddenInput = null

  initialize() {
    this.id = 'date-field-' + _.random(0, 1000000)
    jQuery(this.element).attr('id', this.id).attr("data-target-input", "nearest");
    this.input = jQuery(this.element).find("> input[type='text']")
    this.input.data("target", "#" + this.id)
    this.input.addClass("datetimepicker-input")
    this.input.attr("data-toggle", "datetimepicker")
    this.hiddenInput = jQuery(this.element).find("> input[type='hidden']")

    jQuery("#" + this.id).datetimepicker({
        dayViewHeaderFormat: 'YYYY年 M月',
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
        format: 'YYYY / M / D (ddd)',
        locale: 'ja',
        buttons: {
            showClose: true
        }
    });

    jQuery("#" + this.id).on('show.datetimepicker', event => {
      jQuery(event.target).find("> div").css("top", "40px")
    })

    jQuery("#" + this.id).on('change.datetimepicker', event => {
      this.cp2HiddenInput(event)
    })
  }

  cp2HiddenInput(event) {
    this.hiddenInput.val(event.date.format("YYYY-MM-DD"))
    console.log(this.hiddenInput.val())
  }
}