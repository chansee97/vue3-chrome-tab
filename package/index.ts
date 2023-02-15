import { App } from 'vue';
import Vue3ChromeTabs from './vue3-chrome-tabs.vue';
import type { Tab, TabsIns } from './types';

const install = (app: App) => {
	app.component('Vue3ChromeTabs', Vue3ChromeTabs);
};

// Vue3ChromeTabs.install = install;

export { Vue3ChromeTabs,TabsIns, Tab };

export default install;
