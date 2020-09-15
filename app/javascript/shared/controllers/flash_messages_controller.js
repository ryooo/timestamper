import { Controller } from "stimulus"
import _ from "lodash"

export default class extends Controller {
  static targets = ['message']

  initialize() {
    this._showFirstMessage()
    this._removeFirstMessageAfterTimeout()
  }

  disconnect() {
    this.removeAllMessages() 
  }

  addMessage(messageHTML) {
    this.removeAllMessages()
    $(this.element).prepend(messageHTML)
    this._showFirstMessage()
    this._removeFirstMessageAfterTimeout()
  }

  removeAllMessages() {
    this.messageTargets.forEach(element => {
      $(element).remove()
    })
  }

  removeMessage(event) {
    $(event.currentTarget).closest('.flash-message').remove()
  }

  _showFirstMessage() {
    setTimeout(() => {
      if (this.hasMessageTarget) this.messageTarget.classList.toggle('visible', true)
    }, 50)
  }

  _removeFirstMessageAfterTimeout() {
    if (this.hasMessageTarget) {
      let firstMessage = this.messageTarget
      setTimeout(() => $(firstMessage).remove(), 5000)
    }
  }
}

window.addFlashMessage = (json) => {
  let controller = findController('flash-messages')
  if (controller) {
    let compiled = _.template($("#flash-message-template").html());
    let type = (json.type != "notice" ? json.type : "notice");
    controller.addMessage(compiled({
      "type": type,
      "icon": (type == "notice" ? "fa-check-circle" : "fa-exclamation-triangle"),
      "message": json.message,
    }))
  }
}
