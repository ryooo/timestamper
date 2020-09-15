import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ['button', 'item', 'itemInput', 'list', 'searchInput']

  initialize() {
    this._checkInitialValues()
    this._setDivider()
    this.updateButton()
  }

  clearAll() {
    this._updateCheckBoxes(false)
    this.updateButton()
  }

  focusSearch() {
    if (this.hasSearchInputTarget) setTimeout(() => this.searchInputTarget.focus(), 50)
  }

  updateButton() {
    if (this.hasButtonTarget) {
      this.buttonTarget.innerHTML = this._buttonHTML || this._buttonPlaceholder
    }
  }

  preventDropdownClose(event) {
    event.stopPropagation()
  }

  refreshDivider(dividerValues) {
    $(this.element).data('divider-values', dividerValues)
    $(this.element).find('.select-list-divider').remove()
    this._setDivider()
  }

  searchKeyup() {
    this.itemTargets.forEach(element => {
      element.classList.toggle('d-none', !this._itemInSearch(element))
    })
  }

  selectAll() {
    this._updateCheckBoxes(true)
    this.updateButton()
  }

  _checkInitialValues() {
    this.itemInputTargets.forEach(element => {
      element.checked = this._itemIsChecked(element)
    })
  }  

  _itemIsBelowDivider(item) {
    var value = this._itemInput(item).value
    if (!value) return false
    return !this._dividerValuesArray.includes(value)
  }

  _itemInput(item) {
    return item.getElementsByTagName('input')[0]
  }

  _itemIsChecked(item) {
    if (!this._selectedValuesArray.length && !item.value) return true
    return this._selectedValuesArray.includes(item.value)
  }

  _itemLabel(item) {
    return item.getElementsByClassName('select-list-item-label')[0]
  }

  _itemInSearch(item) {
    if (this._searchQuery.length <= 2) return true
    return this._itemLabel(item).textContent.toLowerCase().indexOf(this._searchQuery) >= 0
  }

  _moveItemsBelowDivider() {
    this.itemTargets.forEach(element => {
      if (this._itemIsBelowDivider(element)) $(element).appendTo($(this.listTarget)) 
    })
  }

  _updateCheckBoxes(checked) {
    this.itemInputTargets.forEach(element => {
      element.checked = checked
    })
  }

  _setDivider() {
    if (this._dividerName) {
      $(this.listTarget).append(this._dividerHTML)
      this._moveItemsBelowDivider()
    }
  }

  get _buttonHTML() {
    let html = ''
    this.itemTargets.forEach(element => {
      if (this._itemInput(element).checked) {
        html += this._itemLabel(element).outerHTML
      }
    })
    return html
  }

  get _buttonPlaceholder() {
    return "<div class='placeholder'>クリックして選択</div>" 
  }

  get _dividerName() {
    return $(this.element).data('divider-name')
  }

  get _dividerHTML() {
    return `<div class='select-list-divider'>${this._dividerName}</div>`
  }

  get _dividerValuesArray() {
    var attribute = $(this.element).data('divider-values')
    if (!attribute) return []
    return attribute.map(v => v.toString())
  }

  get _searchQuery() {
    return this.searchInputTarget.value.toLowerCase()
  }

  get _selectedValuesArray() {
    var attribute = $(this.element).data('selected-values')
    if (!attribute) return []
    return attribute.map(v => v.toString())
  }
}