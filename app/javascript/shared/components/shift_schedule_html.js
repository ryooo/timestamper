import ScheduleHtml from 'shared/components/schedule_html'
import { html } from 'lit-html'
import { durationDisplay } from 'shared/utilities/duration'

export default class ShiftScheduleHtml extends ScheduleHtml {
  get _classes() {
    return {
      'has-swap': this._attributes.swap_id,
      'not-assigned': !this._attributes.assignment_id,
      'not-published': !this._attributes.published
    }
  }

  get _details() {
    const result = []
    result.push(this._attributes.user_id)
    result.push(this._detailNote())
    return result
  }

  get _indicators() {
    const result = [this._indicatorNote()]
    if (this._attributes.conflict) result.push(this._indicatorIcon('exclamation-circle', 'Error'))  
    if (this._attributes.swap_id) result.push(this._statusIcon('status'))
    if (this._attributes.quantity > 1) result.push(html`<div class="quantity" data-tooltip="Shift Slots">${this._attributes.quantity}</div>`)
    return result
  }

  get _innerHTML() {
    return html`
      ${this._colorBorderHTML}
      ${this._headingHTML}
      ${this._detailsHTML}
    `
  }
}
