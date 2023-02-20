import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import 'v-calendar/dist/style.css';
import {registerLicense} from '@syncfusion/ej2-base';

import '../node_modules/@syncfusion/ej2-base/styles/material.css';
import '../node_modules/@syncfusion/ej2-inputs/styles/material.css';
import '../node_modules/@syncfusion/ej2-popups/styles/material.css';
import '../node_modules/@syncfusion/ej2-lists/styles/material.css';
import "../node_modules/@syncfusion/ej2-vue-calendars/styles/material.css";

import './assets/main.scss'
import mitt from 'mitt';
import 'normalize.css'
const pinia = createPinia()


registerLicense("	Mgo+DSMBaFt/QHRqVVhkVFpHaV5DQmFJfFBmRGJTf1p6dlNWESFaRnZdQV1hSXdSd0VkW3lZdnVV;Mgo+DSMBPh8sVXJ0S0J+XE9AflRBQmJIYVF2R2BJfl96dFFMYlpBNQtUQF1hSn5RdkxiWH9ZcnJSQWhc;ORg4AjUWIQA/Gnt2VVhkQlFacldJXnxIf0x0RWFab19xflVCal5XVAciSV9jS31TdEVqWH5ed3ZTQWlVUQ==;MTA5OTE4OUAzMjMwMmUzNDJlMzBjZHhKUDA0QkJ4MmZCYjZMU25GTUhwdXJ6TnFqdDA3Y1RlWUlGVG54NGZZPQ==;MTA5OTE5MEAzMjMwMmUzNDJlMzBJREJnT2JxVjhtMHl0THVqUWl0ZER1Q0g0WjU4b3J1SXR1UEJnTXI4bWxvPQ==;NRAiBiAaIQQuGjN/V0Z+WE9EaFtKVmBWf1JpR2NbfE5xdV9GZFZTQmYuP1ZhSXxQdkdjUH5fcHNXQGhUVEE=;MTA5OTE5MkAzMjMwMmUzNDJlMzBqeFJFVWpFZ1o3SEJpRi9ZSnFTRmJGQllmU3pEd2F4aWNUYnRIUGtEQnVRPQ==;MTA5OTE5M0AzMjMwMmUzNDJlMzBneWVnU256NWZUSUZTK2syRUpZZHFObEZoQXZpZmRCSVBtTjVJbHh3dG8wPQ==;Mgo+DSMBMAY9C3t2VVhkQlFacldJXnxIf0x0RWFab19xflVCal5XVAciSV9jS31TdEVqWH5ed3ZTT2VUVw==;MTA5OTE5NUAzMjMwMmUzNDJlMzBDNW00Y0VNaXIvVktVTXMvRWdaaWJ0bVVYMktuY1liUE5rbXBHajg0YkkwPQ==;MTA5OTE5NkAzMjMwMmUzNDJlMzBra0QvcTZROVIrRjJTRDhQZEhBcXMyMWk2RVFhU0RJN1J1MksvVW03RHU0PQ==;MTA5OTE5N0AzMjMwMmUzNDJlMzBqeFJFVWpFZ1o3SEJpRi9ZSnFTRmJGQllmU3pEd2F4aWNUYnRIUGtEQnVRPQ==")


const emitter = mitt();
const app = createApp(App).use(pinia).use(router);
app.config.globalProperties.emitter = emitter;
app.mount("#app")

