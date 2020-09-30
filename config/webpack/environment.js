const { environment } = require('@rails/webpacker')
var webpack = require('webpack');

environment.plugins.append(
  'Provide',
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    jquery: 'jquery',
    Popper: 'popper.js/dist/popper',
    _: 'lodash',
    'window._': 'lodash',
    moment: "moment",
  })
)
module.exports = environment