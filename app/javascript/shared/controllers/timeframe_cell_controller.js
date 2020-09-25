import { Controller } from "stimulus"

export default class extends Controller {

  showTimeframeModal(event) {
    let compiled = _.template($("#stamp-show-modal-template").html());
    showModal({
      type: 'popup',
      html: compiled(JSON.parse(this.data.get("json"))),
    })
  }
}