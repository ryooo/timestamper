import { Controller } from "stimulus"

import dt from 'datatables.net-bs4';

export default class extends Controller {
  static targets = []
  _table = null

  connect() {
//     this._table = $(this.element)
//     this._table.dataTable( {
//     fixedHeader: {
//         header: true,
//         footer: true
//     }
// } )
  }
}
