<template>
    <CalendarHeader/>

    <div class="calendar">
        <div class="container">
            <div class="flexCalendar">
                <div class='v-calendarAll'>
                    <DatePicker
                        color="blue"
                        v-model.lazy="date"
                        :dayNamesNarrow="azLocale"
                        mode="date"
                        locale="en"
                        @dayclick="dayClicked"
                        :attributes="attrs"
                        title-position="left"
                        is-inline
                        :rows="2"
                        ref="datePicker"
                    />
                </div>

                <div class="table-wrapper">
                    <div class="loaderGif" v-if="loader">
                        <loading/>
                    </div>

                    <Table
                        @success="download"
                        :key="componentKey"
                        :itemLable="formattedDate"
                        :itemDate="selectedDay?.id"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {Calendar, DatePicker} from "v-calendar";
import CalendarHeader from "./CalendarHeader.vue";
import Table from "./CalendarTable.vue";
import moment from "moment";
import {ref} from "vue";
import Loading from "@/components/Loading.vue";

export default {
    components: {
        Loading,
        Calendar,
        DatePicker,
        CalendarHeader,
        Table,
    },

    setup() {
        const componentKey = ref(0);

        return {componentKey};
    },

    mounted() {
        const datePicker1 = document.querySelectorAll('.v-calendarAll .vc-pane')[0].querySelectorAll('.vc-weekday');
        const datePicker2 = document.querySelectorAll('.v-calendarAll .vc-pane')[1].querySelectorAll('.vc-weekday');
        // const datePicker3 = document.querySelectorAll('.v-calendarAll .vc-pane-container .vc-title');

        datePicker1.forEach((item, i) => {
            item.textContent = this.azLocale[i]
        });

        datePicker2.forEach((item, i) => {
            item.textContent = this.azLocale[i]
        });

        // console.log('aaaaaaaaaaaa', datePicker3)

        // setTimeout(() => {
        //     this.$refs.datePicker.$locale.dayNamesNarrow = [...this.azLocale[0]]
        //     console.log('datePicker', this.$refs.datePicker.$locale.dayNamesNarrow)
        // }, 4000)
    },

    methods: {
        download() {
            this.loader = false
        },
        dayClicked(day) {
            this.selectedDay = day;
            this.componentKey += this.selectedDay.day;
            this.loader = true;
        },
    },

    computed: {
        // aaa() {
        //     this.$refs.datePicker.$locale.dayNamesNarrow = [...this.azLocale[0]]
        // },
        formattedDate() {
            return moment(this.date).format("LL");
        }
    },

    data() {
        return {
            selectedDay: {
                id: moment().format(),
                ariaLabel: moment().format("LL")
            }, // Add state to store selected day
            date: moment().format("LL"),
            dates: moment().format("LL"),
            loader: true,
            attrs: [
                {
                    key: "today",
                    highlight: true,
                    dates: moment().format("LL"),
                },
                {
                    dot: true,
                    dates: [
                        moment().format("LL"), // Jan 1st
                    ],
                },
                {
                    dot: true,
                    dates: [
                        moment().format("LL"), // Jan 1st
                    ],
                },
                {
                    dot: true,
                    dates: [
                        moment().format("LL"), // Jan 1st
                    ],
                },
            ],
            azLocale: ['BAZ', 'B.E', 'Ç.A', 'ÇƏR', 'C.A', 'CÜM', 'ŞƏN']
        };
    },
}
</script>