import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ['hiddenInput', 'switch']

  initialize() {
    this.updateSwitch()
    setTimeout(() => this.enableAnimation(), 100)
  }

  clickSwitch() {
    this.value = this.value == 'true' && 'false' || 'true'
    this.updateSwitch()
  }

  updateSwitch() {
    const on = this.value == 'true'
    this.switchTarget.classList.toggle("on", on)
    this.switchTarget.classList.toggle("off", !on)
  }

  enableAnimation() {
    this.switchTarget.classList.toggle('animate', true)
  }

  get value() {
    return this.hiddenInputTarget.value
  }

  set value(value) {
    this.hiddenInputTarget.value = value
    this.hiddenInputTarget.dispatchEvent(new Event('change'))
  }
}