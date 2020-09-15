import { Controller } from 'stimulus'
import { action, computed, observable } from 'mobx'
import Current from 'shared/stores/current'
import Stamps from 'shared/stores/stamps'

export default class extends Controller {
  static targets = [
    'current',
    'stamps',
  ]
  connect() {
    if (this.hasCurrentTarget) {
      window.current.setJson(JSON.parse(this.currentTarget.dataset["json"]))
    }
    if (this.hasStampsTarget) {
      window.stamps.reloadCollection(JSON.parse(this.stampsTarget.dataset["json"]))
    }
  }
}

window.current = new Current
window.stamps = new Stamps

window.resetStores = () => {
  window.stamps.reset()
}

$(document).on('turbolinks:visit', event => {
  resetStores()
})
