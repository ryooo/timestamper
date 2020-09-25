import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ['closeButton', 'modalContent']

  disconnect() {
    this.close()
  }

  close() {
    this._$element.modal('hide')
  }

  show(contentHTML) {
    this._$closeButton.toggleClass('d-none', false)
    this._$modalContent.toggleClass('pulsing', false)
    this._$modalContent.html(contentHTML)
    this._showModal()
  }

  prepare(modalStyle = null) {
    if (this._flashMessagesController) this._flashMessagesController.removeAllMessages()
    this._$modalContent.html(null)
    this._$modalContent.toggleClass('pulsing', true)
    this._$closeButton.toggleClass('d-none', true)
    this._setModalStyle(modalStyle)
    this._showModal() 
  }

  _setModalStyle(modalStyle) {
    this._$modalDialog.attr('class', 'modal-dialog')
    if (modalStyle) this._$modalDialog.toggleClass(modalStyle, true)
  }

  _showModal() {
    $('.dropdown-menu.show').toggleClass('show', false)
    this._$element.modal('show')
  }

  get _$closeButton() {
    return $(this.closeButtonTarget)
  }

  get _$element() {
    return $(this.element)
  }

  get _$modalContent() {
    return $(this.modalContentTarget)
  }

  get _$modalDialog() {
    return this._$element.find('.modal-dialog')
  }

  get _flashMessagesController() {
    return findController('flash-messages')
  }
}

window.showModal = (json) => {
  if (json.type) {
    findController('modals')._setModalStyle(json.type)
  }
  findController('modals').show(json.html)
}

window.closeModal = (contentHTML) => {
  findController('modals').close()
}
