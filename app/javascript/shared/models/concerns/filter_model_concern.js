import pluralize from 'pluralize'
import { includes, indexOf, intersection } from 'lodash' 
import { computed, toJS } from 'mobx' 

const filterModelConcern = (superclass) => class extends superclass {  
  isCollectionFiltered(attribute, ids = []) {
    if (ids.length <= 0) return true
    if (attribute.slice(0, -3) == this.store.modelName) return this._isCollection(ids)
    if (this.attributes[attribute] !== undefined) {
      return includes(ids, this.attributes[attribute])
    } else if (this.attributes[pluralize(attribute)] != undefined) {
      return intersection(ids, this.attributes[pluralize(attribute)]).length > 0
    } 
    return true
  }

  get isCollectionsFiltered() {
    return this._isLocationFiltered && this._isPositionFiltered
  }

  _isCollection(ids = []) {
    if (ids.length <= 0) return true
    return includes(ids, this.id)
  }

  get _isLocationFiltered() {
    return this.isCollectionFiltered('location_id', current.filterLocationIds)
  }

  get _isPositionFiltered() {
    return this.isCollectionFiltered('position_id', current.filterPositionIds)
  }
}

export default filterModelConcern