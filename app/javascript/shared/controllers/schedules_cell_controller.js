import { Controller } from "stimulus"
import { autorun, computed } from 'mobx'
import { html, render } from 'lit-html'
import { repeat } from 'lit-html/directives/repeat'
import { flatten, kebabCase, without } from 'lodash'

export default class extends Controller {
  connect() {
    this._autorunDisposer = autorun(() => this._render())
    //this.element.classList.toggle('no-new', !this._store.newPolicy)
  }

  disconnect() {
    if (this._autorunDisposer) this._autorunDisposer()
  }

  newModel(event) {
    if (this._store.newPolicy) {
      findController('modals').prepare()
      $.ajax({
        url: this._store.newPath,
        data: {[this._store.modelName]: {date: this._date, [current.rowAttribute]: this._rowId}},
        method: 'GET'
      })
    }
  }

  _render() {
    render([this._schedulesHTML, this._moreButtonHTML], this.element)
  }

  get _schedulesHTML() {
    return repeat(this._targetCollection, (m) => m.id, (m) => m.scheduleHTML)
  }

  get _moreButtonHTML() {
    if (this._targetCollection.length < 6) return null
    return html`
      <a class="more-shifts btn btn-default" href="/${current.json.controller}?term=week&amp;start_date=${this._date}">+ ${this._mixedCollection.length - 4} ${current.json.controller}</a>`
  }

  @computed get _targetCollection() {
    return schedules.collection
  }
 
  get _date() {
    return this.data.get('date')
  }
}