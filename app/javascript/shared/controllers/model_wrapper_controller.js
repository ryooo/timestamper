import { Controller } from "stimulus"
import { camelCase } from "lodash"
import pluralize from 'pluralize'

export default class extends Controller {
  click() {
    this._modalsController.prepare(this._model.modalStyle)
    $.get(this._model._showPath)
  }

  get _model() {
    return this._store.find(this.element.dataset.id)
  }

  get _modalsController() {
    return findController('modals')
  }

  get _store() {
    return window[pluralize(camelCase(this.data.get('modelName')))]
  }
}