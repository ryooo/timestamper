import { Controller } from "stimulus"

export default class extends Controller {
  static targets = []

  connect() {
    this._$element.css({"cssText" :
      "background-color : " + this._$element.data("bgColor") + " !important;" +
      "color : " + this._$element.data("fgColor") + " !important;"
    });
  }

  get _$element() {
    return $(this.element)
  }
}
