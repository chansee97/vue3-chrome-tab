import { createApp } from 'vue';
import ChormeTabs from '../package/index';

import App from './App.vue';

const app = createApp(App);

app.use(ChormeTabs);

app.mount('#app');
