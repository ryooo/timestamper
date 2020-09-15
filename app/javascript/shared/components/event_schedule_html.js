import ScheduleItem from 'shared/components/schedule_item'
import { html } from 'lit-html'

export default class EventScheduleItem extends ScheduleItem {
  get _details() {
    return [this._time, this._detailNote()]
  }

  get _headingIcon() {
    return 'star'
  }

  get _indicators() {
    return [this._indicatorNote()]
  }

  get _innerHTML() {
    return html`
      ${this._headingHTML}
      ${this._detailsHTML}
    `
  }

  get _titleHTML() {
    return html`<div class="title">${this._attributes.title}</div>`
  }
}