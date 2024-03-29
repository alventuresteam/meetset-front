import { defineStore } from "pinia";
import axios from "axios";

if (localStorage.getItem("token")) {
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${localStorage.getItem("token")}`;
}

export const useRoomStore = defineStore("rooms", {
  state: () => ({
    rooms: [],
    error: [],

    errorMsg: "",
    token: localStorage.getItem("token") || "",
  }),

  actions: {
    async fetchRoom() {
      try {
        await axios.get("rooms").then((res) => {
          return (this.rooms = res.data);
        });
      } catch (error) {
        console.error(error);
      }
    },

    async createRoom(data) {
      this.error = null;
      this.errorMsg = null;
      await axios
        .post("rooms/create", data)
        .then((res) => {})
        .catch((err) => {
          if (err.response.status === 422) {
            this.error = err.response.data.errors;
            this.errorMsg = err.response.data.message;
            console.error(err.response.data.message);
          }
        });
    },

    async updateRoom(item, data) {
      this.error = null;
      this.errorMsg = null;
      await axios
        .post(`rooms/${item.id}/update`, data)
        .then((res) => {})
        .catch((err) => {
          if (err.response.status === 422) {
            this.errorMsg = err.response.data.message;

            console.error(err.response);
          }
        });
    },
    async removeImage(item, data) {
      this.error = null;
      this.errorMsg = null;
      await axios
          .post(`rooms/${item.id}/remove-image`, data)
          .then((res) => {})
          .catch((err) => {
            if (err.response.status === 422) {
              this.errorMsg = err.response.data.message;

              console.error(err.response);
            }
          });
    },

    async deleteRoom(id) {
      await axios
        .post(`rooms/${id}/delete`)
        .then((res) => {})
        .catch((err) => {
          console.error(err);
        });
    },
  
  },

  getters: {
    getRoom: (state) => state.rooms,
  },
});
