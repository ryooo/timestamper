import { Controller } from "stimulus"
import URI from 'urijs'

export default class extends Controller {
  static targets = ['submitButton', 'refreshWrapper']
  clickedSubmitButton = null

  connect() {
    this._listenForChanges()
    this._registerSubmitButtons()
  }

  disconnect() {
    this._stopListeningForChanges()
  }

  submit(event) {
    this.togglePulsingOfSubmitButtons(true, this.clickedSubmitButton)
  }

  ajaxError(event) {
    this.togglePulsingOfSubmitButtons(false)
  }

  ajaxSuccess(event) {
    this._clearFormErrors()
    this.togglePulsingOfSubmitButtons(false)
    if (!this._turbolinksRedirect(event)) { 
      if (this._modalsController && !this._modalRedirect(event)) this._modalsController.close()
    }
  }

  togglePulsingOfSubmitButtons(state, submitButton = null) {
    if (submitButton) {
      submitButton.classList.toggle('pulsing', true)
    } else {
      this.submitButtonTargets.forEach(element => element.classList.toggle('pulsing', state))
    }
  }

  replaceForm(newForm, refreshForm) {
    if (this._flashMessageController) this._flashMessageController.removeAllMessages()
    if (newForm) {
      if (refreshForm) {
        this._replaceRefreshWrappers(newForm)
      } else {
        this._replaceEntireForm(newForm)
      }
      this._togglePulsingClass(false)
      this._reinitializeOtherFormControllers()
    }
  }

  triggerRefresh() {
    if (this.data.has('refreshPath')) {
      var uri = new URI(`${this.data.get('refreshPath')}?${$(this.element).serialize()}`)
      var href = uri.removeSearch('_method').addSearch('refresh_form', true).href() 
      this._togglePulsingClass(true)
      $.get(href)
    }
  }

  _clearFormErrors() {
    $(this.element).find('.field_with_errors > *').each((index, element) => {
      $(element).unwrap()
    })
    $(this.element).find('.error-feedback').remove()
  }

  _listenForChanges() {
    if (this._autoSave) {
      $(this.element).find('input, select, textarea').on('change', event => {
        railsUJS.fire(this.element, 'submit')
      })
    }
  }

  _reinitializeOtherFormControllers() {
    application.controllers.filter(c => (c.identifier != 'forms' && c.element == this.element)).forEach(controller => {
      controller.initialize()
    })
  }

  _registerSubmitButtons() {
    // We have to do this as a cross-browser hack for Safari. Using document.activeElement does not work.
    $(this.element).find("[type='submit']").on('click', event => {
      this.clickedSubmitButton = event.target
    }) 
  }

  _modalRedirect(event) {
    return event.detail[0].includes('showModal')
  }

  _replaceEntireForm(newForm) {
    this.element.parentNode.replaceChild(newForm, this.element)
  }

  _replaceRefreshWrappers(newForm) {
    let newRefreshWrappers = newForm.querySelectorAll("[data-target='forms.refreshWrapper']")
    this.refreshWrapperTargets.forEach((element, index) => {
      element.parentNode.replaceChild(newRefreshWrappers[index], element)
    })
  }

  _stopListeningForChanges() {
    if (this._autoSave) $(this.element).find('input').on('change')
  }

  _togglePulsingClass(state) {
    $(this.element).toggleClass('pulsing', state)
  }

  _turbolinksRedirect(event) {
    return event.detail[0].includes('Turbolinks.visit')
  }

  get _autoSave() {
    return this.data.get('autoSave')
  }

  get _flashMessageController() {
    return findController('flash-messages')
  }

  get _modalsController() {
    return findController('modals')
  }
}

window.replaceForm = (json) => {
  const newForm = document.createRange().createContextualFragment(json.html).querySelector('form')
  const formId = newForm.getAttribute('id')
  const controller = application.controllers.find(c => {return c.identifier == 'forms' && c.element.getAttribute('id') == formId})
  if (controller) {
    let refreshWrapper = json.refreshWrapper == true ? true : false
    controller.replaceForm(newForm, refreshWrapper)
  }
}
