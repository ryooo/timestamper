import Vue from 'vue'

const files = require.context('shared/templates', true, /\.vue$/);
const components = {};
files.keys().forEach(key => {
  components[key.replace(/(\.\/|\.vue)/g, '')] = files(key).default;
});

Object.keys(components).forEach(key => {
  Vue.component(key, components[key]);
});
