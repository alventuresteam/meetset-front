import { defineStore } from "pinia";
import axios from "axios";

if (localStorage.getItem("token")) {
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${localStorage.getItem("token")}`;
}

export const useSettingStore = defineStore("setting", {
  state: () => ({
    setting: [],
    errors:{},
    token: localStorage.getItem("token") || "",
  }),

  actions: {
    async fetchSetting() {
      try {
        await axios.get("https://meetset.al.ventures/api/setting").then((res) => {
          const setting = res.data;
          return (this.setting = setting);
        });
      } catch (error) {
        console.error(error);
      }
    },

    async updateSetting(item) {
      await axios
        .post(`https://meetset.al.ventures/api/setting/update`, {
            ip_address: item.ip_address,
            port: item.port,
        })
        .then((res) => {

          console.log(res);
        })
        .catch((err) => {
            this.errors = err.response.data.errors

          console.error(err);
        });
    },

  },

  getters: {
    getSetting: (state) => state.setting,
  },
});
