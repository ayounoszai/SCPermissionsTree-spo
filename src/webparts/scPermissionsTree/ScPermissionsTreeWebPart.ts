import { Version } from '@microsoft/sp-core-library';
import {BaseClientSideWebPart} from '@microsoft/sp-webpart-base';

import Vue from 'vue';
import Vuex from 'vuex';
import store from './store';
Vue.use(Vuex);

import axios from 'axios';
axios.defaults.headers.get['Accept'] = "application/json;odata=verbose";

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(fas);
Vue.component('font-awesome-icon', FontAwesomeIcon);


import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);



import ScPermissionsTreeComponent from './components/ScPermissionsTree.vue';

export interface IScPermissionsTreeWebPartProps {}
export default class ScPermissionsTreeWebPart extends BaseClientSideWebPart<IScPermissionsTreeWebPartProps> {
  public render(): void {
    const id: string = `wp-${this.instanceId}`;
    this.domElement.innerHTML = `<div id="${id}"></div>`;

    axios.defaults.baseURL = `${this.context.pageContext.site.absoluteUrl}`;
    store.commit('SET_PAGE_CONTEXT',this.context.pageContext);
    new Vue({
      store,
      render: h => h(ScPermissionsTreeComponent)
    }).$mount(`#${id}`);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  
}
