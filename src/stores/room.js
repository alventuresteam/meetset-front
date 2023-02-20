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
        errors: {},

        token: localStorage.getItem("token") || "",
    }),

    actions: {
        async fetchRoom() {
            try {
                await axios
                    .get("https://meetset.al.ventures/api/rooms")
                    .then((res) => {
                        return this.rooms = res.data;
                    });
            } catch (error) {
                console.error(error);
            }
        },

        async createRoom(name, capacity, address, floor) {
            await axios
                .post("https://meetset.al.ventures/api/rooms/create", {
                    name,
                    capacity,
                    address,
                    floor,
                })
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    this.errors = err.response.data.errors

                    console.error(err);
                });
        },

        async updateRoom(item) {
            await axios
                .post(`https://meetset.al.ventures/api/rooms/${item.id}/update`, {
                    name: item.name,
                    capacity: item.capacity,
                    address: item.address,
                    floor: item.floor,
                })
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.error(err);
                });
        },

        async deleteRoom(item) {
            await axios
                .post(`https://meetset.al.ventures/api/rooms/${item.id}/delete`, {
                    name: item.name,
                    capacity: item.capacity,
                    address: item.address,
                    floor: item.floor,
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
        getRoom: (state) => state.rooms,
    },
});
