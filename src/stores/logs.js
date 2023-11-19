import {defineStore} from "pinia";
import axios from "axios";

if (localStorage.getItem("token")) {
    axios.defaults.headers.common[
        "Authorization"
        ] = `Bearer ${localStorage.getItem("token")}`;
}

export const useLogsStore = defineStore("logs", {
    state: () => ({
        logs: [],
        error: [],
        errorMsg: "",
        token: localStorage.getItem("token") || "",
    }),

    actions: {
        async fetchLogs() {
            try {
                await axios.get("logs").then((res) => {
                    return (this.logs = res.logs);
                });
            } catch (error) {
                console.error(error);
            }
        },
    },

    getters: {
        getLogs: (state) => state.logs,
    },
});