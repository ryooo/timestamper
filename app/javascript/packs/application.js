require("bootstrap");
require("bootstrap-colorpicker");
require("bootstrap-daterangepicker");
require("timepicker");
require('../scss/application.scss');
require("@fortawesome/fontawesome-free/js/solid");


require('../shared/initializers/rails_initializer.js');
require('../shared/initializers/moment_initializer.js');
require('../shared/initializers/turbolinks_initializer.js');
require('../shared/initializers/tooltip_initializer.js');

import { Application } from 'stimulus'
import { definitionsFromContext } from 'stimulus/webpack-helpers'
const application = Application.start()
const context = require.context('../shared/controllers', true, /\.js$/)
application.load(definitionsFromContext(context))

window.application = application
window.findController = function(identifier, element = null) {
  if (element) {
    return application.getControllerForElementAndIdentifier(element, identifier)
  } else {
    return application.controllers.find(c => {return c.identifier == identifier})
  }
}
