import { Controller } from 'stimulus'
import { action, computed, observable } from 'mobx'
import Current from 'shared/stores/current'

export default class extends Controller {
  static targets = [
    'current',
  ]
  connect() {
    if (this.hasCurrentTarget) {
      window.current.setJson(JSON.parse(this.currentTarget.dataset["json"]))
    }
  }
}

window.current = new Current

window.resetStores = () => {
  window.stamps.reset()
}

$(document).on('turbolinks:visit', event => {
  resetStores()
})
