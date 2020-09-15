import { action, computed, toJS, observable, set } from 'mobx'
import { compact } from 'lodash'
import pluralize from 'pluralize'

export default class Model {
  @observable attributes = {}
  @observable id = null
  originalAttributes = {}
  cloned = false
  store = null

  constructor(rowJson) {
    this.id = rowJson['id']
    set(this.attributes, rowJson)
    this.originalAttributes = this._rawAttributes
  }

  save(attributes) {
    this.cloned ? this._create() : this._update(attributes)
  }

  get clone() {
    const instance = new this.constructor({id: moment().valueOf(), attributes: this._rawAttributes})
    instance.cloned = true
    instance.store.collection.push(instance)
    return instance 
  }

  @computed get isFiltered() {
    return true
  }

  @computed get isVisible() {
    return this.isFiltered
  }

  get orderAttributes() {
    return this.attributes.order_attributes
  }

  _create() {
    $.ajax({
      url: this._createPath,
      data: {[this.store.modelName]: this._rawAttributes},
      method: 'POST',
      beforeSend: railsUJS.CSRFProtection,
      context: this,
      complete: response => this.store.collection.remove(this),
      error: response => alert('保存に失敗しました。恐れ入りますが再度お試しください。')
    })
  }

  _update(attributes) {
    $.ajax({
      url: this._updatePath,
      data: {[this.store.modelName]: attributes},
      method: 'PATCH',
      beforeSend: railsUJS.CSRFProtection,
      context: this,
      error: response => {
        set(this.attributes, this.originalAttributes)
        alert('保存に失敗しました。恐れ入りますが再度お試しください。')
      }
    })
  }
  
  get _createPath() {
    return `/${pluralize(this.store.modelName)}/`
  }

  get _updatePath() {
    return `${this._createPath}/${this.id}`
  }

  get _rawAttributes() {
    return toJS(this.attributes)
  }

  get _showPath() {
    return `/${pluralize(this.store.modelName)}/${this.id}`
  }
}