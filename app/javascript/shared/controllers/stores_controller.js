import { Controller } from 'stimulus'
import { action, computed, observable } from 'mobx'
import Current from 'shared/stores/current'
import Schedules from 'shared/stores/schedules'

export default class extends Controller {
  static targets = [
    'schedules',
    'current'
  ]
  connect() {
    window.current.setJson(JSON.parse(this.currentTarget.dataset["json"]))
    schedules.createCollection(JSON.parse(this.schedulesTarget.dataset["json"]))
  }
}

window.current = new Current
window.schedules = new Schedules

window.resetStores = () => {
  window.schedules.reset()
}

$(document).on('turbolinks:visit', event => {
  resetStores()
})
