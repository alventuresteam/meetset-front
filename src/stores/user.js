import { defineStore } from "pinia";
import axios from "axios";

if (localStorage.getItem("token")) {
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${localStorage.getItem("token")}`;
}

export const usePersonStore = defineStore("person", {
  state: () => ({
    person: [],
    errors:{},
    token: localStorage.getItem("token") || "",
  }),

  actions: {
    async fetchPerson() {
      try {
        await axios.get("https://meetset.al.ventures/api/users").then((res) => {
          const person = res.data;
          return (this.person = person);
        });
      } catch (error) {
        console.error(error);
      }
    },


    async createPerson(name, fin_code, position, email, password) {
      await axios
        .post("https://meetset.al.ventures/api/users/create", {
          name,
          fin_code,
          position,
          email,
          password
        })
        .then((res) => {
        })
        .catch((err) => {
            this.errors = err.response.data.errors
            console.error(err);
        });
    },

    async updatePerson(item) {
      await axios
        .post(`https://meetset.al.ventures/api/users/${item.id}/update`, {
            name: item.name,
            fin_code: item.fin_code,
            position: item.position,
            email: item.email,
            password: item.password,
        })
        .then((res) => {

          console.log(res);
        })
        .catch((err) => {
            this.errors = err.response.data.errors

          console.error(err);
        });
    },


    async deletePerson(item) {
        await axios
          .post(`https://meetset.al.ventures/api/users/${item.id}/delete`, {
            name: item.name,
            fin_code: item.fin_code,
            position: item.position,
            email: item.email,
            password: item.password,
          })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.error(err);
          });
      },
  },

  getters: {
    getPerson: (state) => state.person,

  },
});
