import { Controller } from "stimulus"
import { autorun, computed } from 'mobx'
import { html, render } from 'lit-html'
import { repeat } from 'lit-html/directives/repeat'

export default class extends Controller {
  static targets = ['rowsBase']

  connect() {
    this._autorunDisposer = autorun(() => this._render())
  }

  disconnect() {
    if (this._autorunDisposer) this._autorunDisposer()
  }

  _render() {
    if (stamps.loadedAt) {
      render([this._tableHTML], this.rowsBaseTarget)
    }
  }

  get _tableHTML() {
    return repeat(this._tableRows, (m) => m.id, (m) => html`<div>${m.attributes.in_at}</div>`)
  }

  get _tableRows() {
    return stamps.collection
  }
}