import { html } from 'lit-html'
import { modelWrapper } from 'shared/utilities/model_wrapper'
import { compact, kebabCase, pickBy, truncate } from 'lodash'
import { shortTimeSpan } from 'shared/utilities/short_time'

export default class ScheduleHtml {
  model = null

  constructor(model) {
    this.model = model
  }

  get HTML() {
    const classes = Object.assign((this._classes || {}), {'filtered': this.model.isFiltered, 'schedule-cell': true})
    return modelWrapper(this.model, this._innerHTML, {classes: classes, styles: this.model.dayStyles})
  }

// PRIVATE

  _assignmentName(assignmentAttributes) {
    if (assignmentAttributes.user_id) {
      return `${assignmentAttributes.first_name} ${assignmentAttributes.last_name}`
    } else {
      return `Open Shift`
    }
  }

  _detailNote(attribute = 'note') {
    const value = truncate(this._attributes[attribute], {length: 100})
    if (!value || !this._showInlineNote) return null
    return value
  }

  _indicatorIcon(icon, tooltip) {
    return html`<i class="icon-${icon}" data-tooltip="${tooltip}"></i>`
  }

  _indicatorNote(attribute = 'note') {
    const value = this._attributes[attribute]
    if (!value || this._showInlineNote) return null
    return this._indicatorIcon('info-circle', value)
  }

  _statusIcon(attribute) {
    const text = this._attributes[`${attribute}_label`]
    return html`<div class="status ${kebabCase(this._attributes[`${attribute}`])}" data-tooltip="${text}">${text[0]}</div>`
  }

  get _attributes() {
    return this.model.attributes
  }

  get _colorBorderHTML() {
    return html`<i class="color-border" style="background:#${this._attributes.position_color}"></i>`
  }

  get _detailsHTML() {
    const compactDetails = compact(this._details)
    if (compactDetails.length == 0) return null
    return html`<div class="details">${compactDetails.join(' • ')}</div>`
  }

  get _headingHTML() {
    return html`
      <div class="heading">
        ${this._headingIcon ? html`<i class="icon-${this._headingIcon}"></i>` : null}
        ${this._titleHTML}
        ${this._indicatorsHTML}
      </div>`
  }

  get _indicatorsHTML() {
    const compactIndicators = compact(this._indicators)
    if (compactIndicators.length == 0) return null
    return html`<div class="indicators">${compactIndicators}</div>`
  }

  get _showInlineNote() {
    return current.setting('inline_note_enabled') || current.isTabletOrPhoneVariant
  }

  get _time() {
    if (this.model.store.hasAllDayAttribute && this._attributes.all_day) return 'All Day'
    return shortTimeSpan(this._attributes.start_at, this._attributes.end_at)
  }

  get _titleHTML() {
    return html`<div class="title">${this._time}</div>`
  }
}