import { html } from 'lit-html'
import { classMap } from 'lit-html/directives/class-map'
import { styleMap } from 'lit-html/directives/style-map'
import { kebabCase } from 'lodash'

export function modelWrapper(model, content, options = {}) {
  if(current.isPhoneVariant) {
    return html`<div class='cell assignment-cell round assignment-checkbox round'>
    <input type='checkbox' id="checkbox_${model.id}" style="display:none" onclick="selectTeammate()" class="assignment_chk" value="${model.id}">
    <label for="checkbox_${model.id}"></label></div>
    <a
    class="${classMap(Object.assign(options['classes'] || {}, {[kebabCase(model.store.modelName)]: true}))} assignment-table"
    data-id="${model.id}"
    data-controller="model-wrapper"
    data-target="mobile-pull-to-refresh.observable"
    data-model-wrapper-model-name="${model.store.modelName}"
    data-action="model-wrapper#click"
    data-tooltip="${options['tooltip'] || ''}"
    style=${styleMap(options['styles'])}>
    ${content}
    </a>
  `
  } else {
    return html`
      <a
      class=${classMap(Object.assign(options['classes'] || {}, {[kebabCase(model.attributes['type'])]: true}))}
      data-id="${model.id}"
      data-controller="model-wrapper"
      data-target="mobile-pull-to-refresh.observable"
      data-model-wrapper-model-name="${model.store.modelName}"
      data-action="model-wrapper#click"
      data-tooltip="${options['tooltip'] || ''}"
      style=${styleMap(options['styles'])}>
      ${content}
      </a>
    `
  }
}