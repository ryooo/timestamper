import Rails from "@rails/ujs"

if (window.railsUJS == undefined) {
  Rails.start()
  window.railsUJS = Rails
}