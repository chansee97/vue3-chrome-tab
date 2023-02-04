import { createApp } from 'vue';
import chromeTabs from '../package/index';

import App from './App.vue';

const app = createApp(App);

app.use(chromeTabs);

app.mount('#app');
