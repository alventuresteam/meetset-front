import { defineStore } from "pinia";
import axios from "axios";

if (localStorage.getItem("token")) {
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${localStorage.getItem("token")}`;
}

export const useUserStore = defineStore("user", {
  state: () => ({
    user: [],
    error:'',
    token: localStorage.getItem("token") || "",
  }),

  actions: {
    async fetchUser() {
      try {
        await axios
          .get("https://meetset.al.ventures/api/auth/user")
          .then((res) => {
            const user = res.data.user;
            return (this.user = user);
          });
      } catch (error) {
        console.error(error);
      }
    },

    async signIn(email, password) {
      await axios
        .post("https://meetset.al.ventures/api/auth/login", { email, password })
        .then((res) => {
          const token = res.data.token;
          const user = res.data.user;

          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          this.user = user;
          this.error = null;
          console.log(user);
        })
        .catch((err) => {
            if (err.response.status === 422) {
                this.error = err.response.data.message;
              }
          console.error(err);
        });
    },

    async signOut() {
      await localStorage.removeItem("token");
      await localStorage.removeItem("user");

      console.log()
    },
  },

  getters: {
    getUser(state) {
      return state.user;
    },
  },
});
