import { camelCase, compact, get, groupBy, without } from 'lodash' 
import { computed } from 'mobx'

const cellCollectionLookupStoreConcern = (superclass) => class extends superclass {  
  cellCollectionLookup(collectionType = 'filtered', rowId, date) {
    return this._lookup(collectionType, rowId, date)
  }

// PRIVATE

  _collectionFromArray(array) {
    return this[`_${camelCase(array.join('-'))}`]
  }

  _group(collection, groupAttributes) {
    return groupBy(collection, model => groupAttributes.map(key => get(model, key)))
  }

  _lookup(collectionType, rowId, date) {
    let collectionNameSuffix = `${collectionType}Collection`
    let adjustedDate = this.hasAllDayAttribute ? undefined : date
    let attributeArray = without([rowId, adjustedDate], undefined)
    if (attributeArray.length == 0) {
      var collection = this[collectionNameSuffix]
    } else {
      let collectionNameArray = ['grouped', collectionNameSuffix]
      if (adjustedDate !== undefined) collectionNameArray.unshift('date')
      if (rowId !== undefined) collectionNameArray.unshift('row')
      var collection = this._collectionFromArray(collectionNameArray)[attributeArray] || []
    }
    return this._onDateLookup(collection, date)
  }

  _onDateLookup(collection, date) {
    if (!this.hasAllDayAttribute || date == undefined) return collection
    return collection.filter(model => model.onDate(date))
  }

  get _rowAttributeKey() {
    return current.rowAttribute ? `attributes.${current.rowAttribute}`  : null
  }

  @computed get _dateGroupedAvailableCollection() {
    return this._group(this.availableCollection, ['date'])
  }

  @computed get _dateGroupedBaseFilteredCollection() {
    return this._group(this.baseFilteredCollection, ['date'])
  }

  @computed get _dateGroupedFilteredCollection() {
    return this._group(this.filteredCollection, ['date'])
  }

  @computed get _dateGroupedVisibleCollection() {
    return this._group(this.visibleCollection, ['date'])
  }

  @computed get _rowDateGroupedBaseFilteredCollection() {
    return this._group(this.baseFilteredCollection, [this._rowAttributeKey, 'date'])
  }

  @computed get _rowDateGroupedFilteredCollection() {
    return this._group(this.filteredCollection, [this._rowAttributeKey, 'date'])
  }

  @computed get _rowDateGroupedVisibleCollection() {
    return this._group(this.visibleCollection, [this._rowAttributeKey, 'date'])
  }

  @computed get _rowGroupedBaseFilteredCollection() {
    return this._group(this.baseFilteredCollection, [this._rowAttributeKey])
  }

  @computed get _rowGroupedFilteredCollection() {
    return this._group(this.filteredCollection, [this._rowAttributeKey])
  }

  @computed get _rowGroupedVisibleCollection() {
    return this._group(this.visibleCollection, [this._rowAttributeKey])
  }
}

export default cellCollectionLookupStoreConcern