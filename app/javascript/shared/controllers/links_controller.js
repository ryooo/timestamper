import { Controller } from "stimulus"

export default class extends Controller {
  initialize() { 
    this._toggleActiveClass()
    this.togglePulse(false)
  }

  click(event) {
    if (this._blockCommandClick(event)) return event.preventDefault()
    this._$element.tooltip('hide')
    if (this.data.get('modal')) this._remoteModalController.prepare(this.data.get('modal'))
    if (this.data.get('disable')) this.togglePulse(true)
  }

  togglePulse(state) {
    this._$element.toggleClass('pulsing', state)
  }

  _blockCommandClick(event) {
    return this.element.getAttribute('data-remote') && event.metaKey
  }

  _toggleActiveClass() {
    this._$element.toggleClass('active-link', this._isActive)
  }

  get _currentPath() {
    return window.location.pathname
  }

  get _$element() {
    return $(this.element)
  }

  get _href() {
    return this._$element.attr('href')
  }

  get _isActive() {
    return (this._href == this._currentPath) || this._regexMatch
  }

  get _regexMatch() {
    if (this._currentPath.search(this.data.get('excludePattern')) >= 0) return false
    return this._currentPath.search(this.data.get('activePattern')) >= 0 
  }

  get _remoteModalController() {
    return findController('modals')
  }
}