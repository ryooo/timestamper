import { Controller } from "stimulus"

export default class extends Controller {
  submit(event) {
    if (this._recaptchaV3Input) {
      event.preventDefault()
      grecaptcha.execute(this._recaptchaV3SiteKey, {action: 'users_create'}).then(token => {
        this._recaptchaV3Input.value = token
        railsUJS.fire(this.element, 'submit')
      })
    }
  }
  
  get _recaptchaV3Input() {
    return document.getElementById('recaptchaResponse')
  }

  get _recaptchaV3SiteKey() {
    return this._recaptchaV3Input.getAttribute('data-sitekey')
  }
}