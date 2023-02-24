<template>
    <CalendarHeader/>

    <div class="calendar">
        <div class="container">
            <div class="flexCalendar">
                <div class='v-calendarAll'>
                    <DatePicker
                        :is24hr="true"
                        color="blue"
                        v-model.lazy="date"
                        :dayNamesNarrow="azLocale"
                        mode="date"
                        locale="ru"
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
                        <img class="animationLoad" loading="lazy" src="../../assets/images/gif/load.svg" alt="gif"/>
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
    import { Calendar, DatePicker } from "v-calendar";
    import CalendarHeader from "./CalendarHeader.vue";
    import Table from "./CalendarTable.vue";
    import moment from "moment";
    import { ref } from "vue";

    export default {
        components: {
            Calendar,
            DatePicker,
            CalendarHeader,
            Table
        },

        setup() {
            const componentKey = ref(0);
            return { componentKey };
        },

        mounted() {
            // setTimeout(() => {
            //     this.$refs.datePicker.$locale.dayNamesNarrow = [...this.azLocale[0]]
            // }, 4000)

            console.log('datePicker', this.$refs.datePicker)
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
                azLocale: [
                    ['1', '2', '3', '4', '5', '6', '7']
                ]
            };
        },
    }
</script>