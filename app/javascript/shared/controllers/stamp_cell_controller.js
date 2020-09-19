import { Controller } from "stimulus"

export default class extends Controller {

  showModal(event) {
    let compiled = _.template($("#stamp-show-modal-template").html());
    showModal({
      html: compiled(JSON.parse(this.element.dataset.stampCellJson))
    })
  }
}