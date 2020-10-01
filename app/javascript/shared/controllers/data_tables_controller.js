import { Controller } from "stimulus"

import dt from 'datatables.net-bs4';

export default class extends Controller {
  static targets = ['table']
  _datatables = null
  _table = null
  _dataset = null

  connect() {
    this._dataset = JSON.parse(this.data.get("dataset-json"))
    this._table = $(this.tableTarget)
    this._datatables = this._table.dataTable(
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
                <a class="btn btn-sm btn-info operation-btn" data-action="data-tables#showEditModal" href="javascript:void(0);" data-id="' + row.id + '"><i class="fas fa-pencil-alt"></i>編集</a>\
                <a class="btn btn-sm btn-danger operation-btn" data-action="data-tables#deleteRow" href="javascript:void(0);" data-id="' + row.id + '"><i class="fas fa-trash-alt"></i>削除</a>\
              ';
            },
          },
        ]),
        dom: '<<t>ip>',
        language: {
            url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Japanese.json"
        },
        rowId: function(row) {
          return 'datatables-row-' + row.id;
        },
      },
    )

    $("#data-tables-filter-input").on('keyup', event => { 
      this.filterRows(event)
    })

    this._table.on('draw.dt', event => { 
      $(".left-controls").html($(".dataTables_info"))
      $(".dataTables_paginate").appendTo($(".right-controls"))
    })
  }

  filterRows(event) {
    this._table.fnFilter($(event.target).val());
  }

  showEditModal(event) {
    let id = parseInt(event.currentTarget.dataset.id)
    let row = this._dataset.find(r => r.id == id)
    let compiled = _.template($("#" + this.data.get("update-modal-id")).html());
    showModal({
      type: 'popup',
      html: compiled(row),
    })
  }

  deleteRow(event) {
    let id = parseInt(event.currentTarget.dataset.id)
    let row = this._dataset.find(r => r.id == id)
    let compiled = _.template($("#" + this.data.get("delete-modal-id")).html());
    showModal({
      type: 'popup',
      html: compiled(row),
    })
  }

  patchDataset(h) {
    this._dataset = this._dataset.filter(row => row.id !== h.data.id)
    if (h.operation == "update") {
      this._dataset = this._dataset.concat(h.data)
      this._datatables.fnUpdate(h.data, $("#datatables-row-" + h.data.id))
    } else if (h.operation == "delete") {
      this._datatables.fnDeleteRow($("#datatables-row-" + h.data.id))
    }
  }
}

window.patchDataTables = function (json) {
  let controller = findController("data-tables")
  if (controller) {
    for (let h of json.operations) {
      controller.patchDataset(h)
    }
  }  
}

