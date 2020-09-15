import { action, computed, observable } from 'mobx'
import { compact, orderBy, replace } from 'lodash'
import URI from 'urijs'
import pluralize from 'pluralize'
import { JSONFetch } from 'shared/utilities/json_fetch'

export default class Store {
  collection = []
  columns = {}
  modelClass = null
  modelName = null
  order = null
  searchQuery = null
  sort = null
  @observable loadedAt = null;

  @action createModel(rowJson) {
    const model = new this.modelClass(rowJson)
    this.collection.push(model)
    return model
  }

  @action createCollection(rowsJson) {
    rowsJson.forEach(rowJson => this.createModel(rowJson))
  }

  @action reloadCollection(rowsJson) {
    this.reset()
    rowsJson.forEach(rowJson => this.createModel(rowJson))
    this.loadedAt = Date.now()
  }

  @action destroyModel(modelId) {
    const model = this.find(modelId)
    if (model) {
      this.collection.remove(model)
      this._addPaginationAdjustmentId(modelId)
    }
    return model
  }

  @action destroyCollection(collectionIds) {
    collectionIds.forEach(modelId => this.destroyModel(modelId))
  }

  find(id) {
    return this.collection.find(model => model.id == parseInt(id))
  }

  @action updateModel(rowJson) {
    this.destroyModel(rowJson['id'])
    return this.createModel(rowJson)
  }

  @action updateCollection(rowsJson) {
    rowsJson.forEach(rowJson => this.updateModel(rowJson))
  }

  @action reset() {
    this.collection = []
    this.columns = {}
    this.order = null
    this.sort = null
  }

  @computed.struct get baseFilteredCollection() {
    return this.orderedCollection.filter(model => model.isBaseFiltered)
  }

  @computed.struct get filteredCollection() {
    return this.orderedCollection.filter(model => model.isFiltered)
  }

  @computed get filteredIds() {
    return this.filteredCollection.map(model => model.id)
  }

  @computed get ids() {
    return this.collection.map(model => model.id)
  }

  @computed.struct get orderedCollection() {
    return orderBy(this.collection, this._orderArray, this._sortArray)
  }

  @computed.struct get visibleCollection() {
    return this.orderedCollection.filter(model => model.isVisible)  
  }

  get newPath() {
    return new URI(`/${this.modelName}/new`).href()
  }

  get _order() {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('order') || this.order || this.defaultOrder
  }

  get _orderArray() {
    if (!this.collection.length) return []
    return this.collection[0].orderAttributes[this._order].map((v,i) => `orderAttributes.${this._order}[${i}]`).concat('id')
  } 

  get _sort() {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('sort') || this.sort || this.defaultSort || 'asc'
  }

  get _sortArray() {
    if (!this.collection.length) return []
    return this.collection[0].orderAttributes[this._order].map(v => this._sort).concat('asc')
  }
}
