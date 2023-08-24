import { defineStore } from "pinia";
import axios from "axios";

if (localStorage.getItem("token")) {
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${localStorage.getItem("token")}`;
}

export const useReservationStore = defineStore("reservation", {
  state: () => ({
    reservation: [],
    error: [],
    contacts:[],
    errorMsg: "",

    token: localStorage.getItem("token") || "",
  }),

  actions: {
    async fetchReservation() {
      try {
        await axios
          .get("reservations")
          .then((res) => {
            return (this.reservation = res.data);
          });
      } catch (error) {
        console.error(error);
      }
    },

    async createReservation(
      start_date,
      start_time,
      end_time,
      room_id,
      organizer_name,
      emails,
      title,
      comment
    ) {
      this.error = null;
      this.errorMsg = null;

      await axios
        .post("reservations/create", {
          start_date,
          start_time,
          end_time,
          room_id,
          organizer_name,
          emails,
          title,
          comment,
        })
        .then((res) => {

          
        })
        .catch((err) => {
          if (err.response.status === 422) {
            this.error = err.response.data.errors;
            if (!this.error) this.errorMsg = err.response.data.message;

            console.error(err.response);
          }
        });
    },

    async updateReservation(item) {
      this.error = null;
      this.errorMsg = null;
      await axios
        .post(
          `reservations/${item.id}/update`,
          {
            start_date: item.start_date,
            start_time: item.start_time,
            end_time: item.end_time,
            room_id: item.room_id,
            organizer_name: item.organizer_name,
            emails: item.emails,
            title: item.title,
            comment: item.comment,
          }
        )
        .then((response) => {
        
        })
        .catch((err) => {
          if (err.response.status === 422) {
            this.error = err.response.data.errors;
            if (!this.error) this.errorMsg = err.response.data.message;

            console.error(err.response);
          }
        });
    },

    async deletReservation(item) {
      await axios
        .post(
          `reservations/${item.id}/delete`,
          {
            start_date: item.start_date,
            start_time: item.start_time,
            end_time: item.end_time,
            room_id: item.room_id,
            organizer_name: item.organizer_name,
            emails: item.emails,
            title: item.title,
            comment: item.comment,
          }
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
           if (err.response.status === 422) {
              this.error = err.response.data.errors;
              this.errorMsg = err.response.data.message;
              console.error(err.response.data.message);
           }
        });
    },
      async searchContact(item) {
      await axios
        .get(`search-contacts?q=${item}`)
        .then((res) => {return (this.contacts = res.data)})
        .catch((err) => {
          console.error(err);
        });
    },
  },

  getters: {
    getReservations: (state) => state.reservation,
    getContact: (state) => state.contacts
  },
});
