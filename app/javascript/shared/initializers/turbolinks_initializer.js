import Turbolinks from 'turbolinks'

Turbolinks.start()
if (!Turbolinks.supported) Turbolinks.dispatch('turbolinks:load')
  