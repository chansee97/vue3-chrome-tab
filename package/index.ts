import { App } from 'vue';
import Vue3ChromeTabs from './vue3-chorme-tabs.vue';
import type { Tab } from './types';

const install = (app: App) => {
	app.component('Vue3ChromeTabs', Vue3ChromeTabs);
};

// Vue3ChromeTabs.install = install;

export { Vue3ChromeTabs, Tab };

export default install;
