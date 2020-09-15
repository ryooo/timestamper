import { computed } from 'mobx'
import Model from 'shared/models/model'
import filterModelConcern from 'shared/models/concerns/filter_model_concern'
import timeframeModelConcern from 'shared/models/concerns/timeframe_model_concern'
import ShiftScheduleHTML from 'shared/components/shift_schedule_html'

export default class Schedule extends timeframeModelConcern(filterModelConcern(Model)) {
  store = schedules

  @computed get isVisible() {
    return true
  }

  get scheduleHTML() {
    return new ShiftScheduleHTML(this).HTML
  }
}