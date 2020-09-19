import { computed } from 'mobx'
import Model from 'shared/models/model'
import timeframeModelConcern from 'shared/models/concerns/timeframe_model_concern'

export default class Stamp extends timeframeModelConcern(Model) {
  store = stamps
}