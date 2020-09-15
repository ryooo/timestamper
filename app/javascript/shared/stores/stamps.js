import Store from 'shared/stores/store'
import Stamp from 'shared/models/stamp'
import { action, computed } from 'mobx'
import { JSONFetch } from 'shared/utilities/json_fetch'

export default class Stamps extends Store {
  defaultOrder = 'start_at'
  modelClass = Stamp
  modelName = 'stamp'
}