import {fileURLToPath, URL} from "node:url";
import path from 'path';

import { defineConfig } from 'vite';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => ['md-linedivider'].includes(tag),
                }
            }
        }),
        Components({
            resolvers: [
                AntDesignVueResolver({
                    importStyle: false, // css in js
                }),
            ],
        }),
    ],
    build: {
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, "index.html"),
                home: path.resolve(__dirname, "src/views/Home.vue"),
                calendar: path.resolve(__dirname, "src/views/Calendar.vue"),
                admin: path.resolve(__dirname, "src/views/Admin.vue"),
            },
        },
    },

    server: {
        host: true,
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@import "@/assets/main.scss";`,
                },
            },
        },
    },
});
