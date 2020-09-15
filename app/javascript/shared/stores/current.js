import { camelCase, indexOf, isEqual, mapValues, omit, pick } from 'lodash'
import { action, computed, observable, set, toJS } from 'mobx'
import URI from 'urijs'
import pluralize from 'pluralize'
import numeral from 'numeral'

export default class Current {
  @observable json = {}

  setting(addonKey) {
    return this.schedule.settings[addonKey]
  }

  filterScope(key) {
    if (!this.filter.scopes) return null
    return this.filter.scopes[key]
  }

  @action setJson(json) {
    set(this.json, json)
  }

  get baseStore() {
    const controllerName = camelCase(this.json.controller)
    return window[controllerName]
  }

  get dateRange() {
    return this.json.date_range
  }

  @computed get filter() {
    return this.json.filter
  }

  @computed get filterLocationIds() {
    return this._normalizeFilterCollectionIds(this.filter.location_ids)
  }

  @computed get filterPositionIds() {
    return this._normalizeFilterCollectionIds(this.filter.position_ids)
  }

  get isTabletOrPhoneVariant() {
    return ['phone', 'tablet'].includes(this.json.variant)
  }

  get isPhoneVariant() {
    return this.json.variant == 'phone'
  }

  get rowAttribute() {
    return this.rowType ? `${pluralize.singular(this.rowType)}_id` : null
  }

  get rowIds() {
    return this.json.row_ids || []
  }

  get rowType() {
    return this.json.row_type || null
  }

  get scope() {
    return this.json.scope || null
  }

  _hasRole(role) {
    const roles = ['user', 'location', 'organization']
    return indexOf(roles, role) <= indexOf(roles, this.user.role)
  }

  _haveFilterCollectionsChanged(filterJson) {
    const collectionKeys = ['location_ids', 'position_ids']
    const currentCollections = mapValues(pick(this.filter, collectionKeys), (ids) => toJS(ids))
    const newCollections = pick(filterJson, collectionKeys)
    return !isEqual(currentCollections, newCollections)
  }

  _normalizeFilterCollectionIds(ids = []) {
    const clonedIds = toJS(ids)
    const blankIndex = indexOf(clonedIds, 'blank')
    if (blankIndex >= 0) clonedIds.splice(blankIndex, 1, null)
    return clonedIds
  }
}