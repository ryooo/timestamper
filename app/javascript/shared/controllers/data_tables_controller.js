import { Controller } from "stimulus"

import dt from 'datatables.net-bs4';

export default class extends Controller {
  static targets = ['table']
  _table = null
  _dataset = null

  connect() {
    this._dataset = JSON.parse(this.data.get("dataset-json"))
    this._table = $(this.tableTarget)
    this._table.dataTable(
      {
        pageLength: 50,
        data: this._dataset,
        columns: JSON.parse(this.data.get("columns-json")).concat([
          {
            title: "操作",
            width: "150px",
            orderable: false,
            searchable: false,
            render: function ( data, type, row ) {
              return '\
                <a class="btn btn-sm btn-info operation-btn" data-action="data-tables#editRow" href="javascript:void(0);" data-row-id="' + row.id + '"><i class="fas fa-pencil-alt"></i>編集</a>\
                <a class="btn btn-sm btn-danger operation-btn" data-action="data-tables#deleteRow" href="javascript:void(0);" data-row-id="' + row.id + '"><i class="fas fa-trash-alt"></i>削除</a>\
              ';
            },
          },
        ]),
        dom: '<f<t>ip>',
        language: {
            url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Japanese.json"
        },
      },
    )
  }

  editRow(event) {
    let rowId = parseInt(event.target.dataset.rowId)
    let row = this._dataset.find(r => r.id == rowId)
    console.log(row)
  }

  deleteRow(event) {
    console.log("deleteRow")
  }
}
