import Store from 'shared/stores/store'
import Schedule from 'shared/models/schedule'
import cellCollectionLookupStoreConcern from 'shared/stores/concerns/cell_collection_lookup_store_concern'
import { action, computed } from 'mobx'
import { JSONFetch } from 'shared/utilities/json_fetch'

export default class Schedules extends cellCollectionLookupStoreConcern(Store) {
  defaultOrder = 'start_at'
  modelClass = Schedule
  modelName = 'schedule'

  @computed.struct get availableCollection() {
    return this.orderedCollection.filter(model => model.isAvailable)
  }

  get newPolicy() {
    return true
  }
}