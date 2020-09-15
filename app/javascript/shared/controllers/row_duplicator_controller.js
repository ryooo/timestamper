import { Controller } from "stimulus"
import { last } from "lodash"

export default class extends Controller {
  static targets = ['copyRow']

  addRow() {
    last(this.copyRowTargets).after(this._rowHTML())
  }

  removeRow(event) {
    $(event.target).closest('.form-row').remove()
  }

  _rowHTML() {
    let clone = $(this.copyRowTarget).clone()
    clone.find("input[type='text']").val('')
    clone.find(".select-list-wrapper").data('selected-values', false)
    clone.find('.field_with_errors > *').each((index, element) => {
      $(element).unwrap()
    })
    clone.find('.error-feedback').remove()
    clone.find('.form-group > label').remove()
    return clone[0]
  }
}