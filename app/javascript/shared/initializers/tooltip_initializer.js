$(document).on('turbolinks:load', event => { 
  $(document).on('mouseover', "[data-tooltip]", event => {
    $(event.currentTarget).tooltip('dispose')
    $(event.currentTarget).tooltip({title: event.currentTarget.getAttribute('data-tooltip')})
    $(event.currentTarget).tooltip('show')
  })
})