<template>
    <div>
        <Suspense v-if="showCalendar">
            <template #default>
                <div class='fullcalendar'>
                    <FullCalendar
                        :key="val"
                        ref="calendar"
                        v-if="showCalendar"
                        :options="options"
                    ></FullCalendar>
                </div>
            </template>

            <template #fallback>Load...</template>
        </Suspense>

        <Suspense v-if="showUpdateModalUser">
            <template #default>
                <ShowReservRoom
                    :item="updateReservation"
                    :itemRoom="updateReservationRoom"
                    v-if="showUpdateModalUser"
                    @deletCalendar="showUpdateModalUser = false"
                    @close-modal="closeModal"
                />
            </template>

            <template #fallback>Load...</template>
        </Suspense>
    </div>
</template>

<script>
import ClientOnly from "vue-client-only";
import {defineComponent, defineAsyncComponent} from "vue";
import FullCalendar from "@fullcalendar/vue3";
import ShowReservRoom from "../Modal/ShowReservRoom.vue";
import moment from "moment";

import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import {useReservationStore} from "../../stores/reservations";
import {useRoomStore} from "../../stores/room";
import {useUserStore} from "../../stores/auth";

import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

export default defineComponent({
    data() {
        return {
            showCalendar: false,
            showUpdateModalUser: false,
            updateDataPerson: {},
            resources: [],
            events: [],
            updateReservationRoom: {},
            className: null,
            delet: false,
            val: 0,
        };
    },

    components: {
        FullCalendar, // make the <FullCalendar> tag available
        ShowReservRoom,
        ClientOnly,
    },

    props: ["itemDate", "itemLable"],

    setup() {
        const ShowReservRoom = defineAsyncComponent({
            loader: () => import("../Modal/ShowReservRoom.vue"),
            delay: 1000,
            timeout: 3000,
            suspensible: true,
        });

        const useStore = useReservationStore();
        const useStoreRoom = useRoomStore();
        const useUserStores = useUserStore();

        return {useStore, useStoreRoom, ShowReservRoom, useUserStores};
    },

    methods: {
        closeModal() {
            this.showUpdateModalUser = false;
            document.querySelector("body").style.overflowY = 'auto'
        },
        handle(item) {
            this.showUpdateModalUser = true;
            document.querySelector("body").style.overflowY = 'hidden'

            this.updateReservation = item;
            this.updateReservationRoom = item;
        },
        refetch() {
            this.resources = [];
            this.events = [];
            this.useStoreRoom?.getRoom?.forEach((item) => {
                this.resources.push({
                    id: `${item?.id}`,
                    title: `${item?.name}`,
                });
            });

            this.useStoreRoom?.getRoom?.forEach((item) => {
                item?.reservations?.forEach((res) => {
                    this.events.push({
                        className: res.user_id == this.useUserStores.getUser.id ? "activeUser" : "",
                        resourceId: `${item?.id}`,
                        id: res.id,
                        start: `${res?.start_date} ${res?.start_time}`,
                        end: `${res?.start_date} ${res?.end_time}`,
                        title: `${res?.organizer_name}`,
                        description: `${res?.start_time} - ${res?.end_time}`,
                    });
                });
            });

            this.$nextTick(() => {
                if (this.events.length > 0) {
                    const lastEvent = this.events.find(item => {
                        let a = moment(this.itemDate).startOf('day');
                        let b = moment(item.start).startOf('day');
                        return a.diff(b, 'days') === 0
                    });

                    const lastEventDate = moment(lastEvent.start).format("HH:mm");
                    this.$refs.calendar.getApi().scrollToTime(lastEventDate);
                }
            })
        },
    },

    computed: {
        options() {
            return {
                plugins: [interactionPlugin, resourceTimelinePlugin],
                timeZone: "UTC",
                initialView: "resourceTimelineDay",
                slotMinWidth: 88,
                slotMinHeight: 68,
                initialDate: this.itemDate,
                locale: "ru-GB",
                scrollTimeReset: false,
                resourceAreaHeaderContent: `İclas otaqları - ${this.itemLable}`,
                resourceAreaWidth: "25%",
                slotLabelFormat: {
                    // hour: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    omitZeroMinute: false,
                    hour12: false,
                },
                eventDidMount: function (info) {
                    tippy(info.el, {
                        content: `Təşkilatçı:  ${info.event.title} <br> Başlama və bitmə: ${info.event.extendedProps.description}`,
                        placement: "top",
                        allowHTML: true,
                        appendTo: document.querySelector(".fc-timeline-lane-frame"),
                        interactive: true,
                    });

                    let elementsList = document.querySelectorAll("a");
                    for (let i = 0; i < elementsList.length; i++) {
                        elementsList[i].setAttribute("href", "#");
                    }
                },

                // eventTimeFormat: {
                //   hour: "2-digit",
                //   minute: "2-digit",
                //   meridiem: false,
                //   hour12: false,
                // },

                eventClick: (args) => {
                    let roomId = parseInt(args.event._def.resourceIds[0]);
                    let reservId = parseInt(args.event._def.publicId);
                    const room = this.useStoreRoom?.getRoom?.find(
                        (item) => item.id == roomId
                    );
                    const reservation = room.reservations.find((item) => item.id == reservId);

                    if (reservation.user_id === this.useUserStores.getUser.id) this.handle(reservation);
                },

                eventClassNames: this.className,
                resources: this.resources,
                // slotMinTime: "08:00:00",
                // slotMaxTime: "18:00:00",
                height: "auto",
                events: this.events,
            };
        },
        azMonth() {
            const title = document.querySelectorAll('.fullcalendar');

            setTimeout(() => {
                return console.log(title)
            }, 3000)
        }
    },

    async mounted() {
        try {
            await this.useStoreRoom.fetchRoom();
            this.$emit("success");
            this.emitter.on("refresh", () => {
                this.refetch();
                this.val++;
            });

            this.useStore.fetchReservation();
            this.useUserStores.fetchUser();
            this.showCalendar = true;
            this.refetch();
        } catch (err) {
            console.log(err);
        }

        // this.azMonth;
    }
});
</script>
