import { computed } from 'mobx'
import Model from 'shared/models/model'
import { intersection } from 'lodash' 
import pluralize from 'pluralize' 
import filterModelConcern from 'shared/models/concerns/filter_model_concern'
import timeframeModelConcern from 'shared/models/concerns/timeframe_model_concern'
import EventScheduleItem from 'shared/components/event_schedule_item'

export default class Event extends timeframeModelConcern(filterModelConcern(Model)) {
  store = events

  isCollectionFiltered(attribute, ids = []) {
    if (ids.length <= 0 ) return true
    let value = this.attributes[pluralize(attribute)]
    if (value != undefined) {
      return value.length == 0 || intersection(ids, value).length > 0
    }
    return true
  }

  @computed get isFiltered() {
    return this.isCollectionsFiltered && this.isParentAssignmentCollectionsFiltered && this.isTimeframeFiltered
  }

  get editPolicy() {
    return current.isSupervisor
  }

  get scheduleItem() {
    return new EventScheduleItem(this).HTML
  }
}