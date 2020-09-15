import Store from 'shared/stores/store'
import Event from 'shared/models/event'
import cellCollectionLookupStoreConcern from 'shared/stores/concerns/cell_collection_lookup_store_concern'

export default class Events extends cellCollectionLookupStoreConcern(Store) {
  defaultOrder = 'timeframe'
  hasAllDayAttribute = true
  modelClass = Event
  modelName = 'event'

  get newPolicy() {
    return current.isSupervisor
  }
}