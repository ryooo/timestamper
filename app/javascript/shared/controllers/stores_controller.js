import { Controller } from 'stimulus'
import { action, computed, observable } from 'mobx'

export default class extends Controller {
  static targets = [
    'current',
    'holidays',
  ]
  connect() {
    if (this.hasCurrentTarget) {
      window.current = JSON.parse(this.currentTarget.dataset["json"])
    }
    if (this.hasHolidaysTarget) {
      window.holidays = _.map(JSON.parse(this.holidaysTarget.dataset["json"]), 'date')
    }
  }
}

window.resetStores = () => {
}

$(document).on('turbolinks:visit', event => {
  resetStores()
})
