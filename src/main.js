import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import 'v-calendar/dist/style.css';
import {registerLicense} from '@syncfusion/ej2-base';
import Toaster from "@meforma/vue-toaster";
import axios from "axios";

import '../node_modules/@syncfusion/ej2-base/styles/material.css';
import '../node_modules/@syncfusion/ej2-inputs/styles/material.css';
import '../node_modules/@syncfusion/ej2-popups/styles/material.css';
import '../node_modules/@syncfusion/ej2-lists/styles/material.css';
import "../node_modules/@syncfusion/ej2-vue-calendars/styles/material.css";
import './assets/main.scss';
import mitt from 'mitt';
import 'normalize.css';


const pinia = createPinia()

axios.defaults.baseURL = 'https://meetset.al.ventures/api/'
registerLicense("Ngo9BigBOggjHTQxAR8/V1NGaF1cWGhAYVF+WmFZfV1gdl9HY1ZRRWYuP1ZhSXxQdk1hUH9ccXdVRGNcWEI=")

const emitter = mitt();

const app = createApp(App).use(pinia).use(router).use(Toaster);

app.config.globalProperties.emitter = emitter;
app.mount("#app")

