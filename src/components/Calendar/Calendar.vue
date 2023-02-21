<template>
  <CalendarHeader />
  <div class="calendar">
    <div class="container">
      <div class="flexCalendar">
        <DatePicker
          color="blue"
          v-model.lazy="date"
          mode="date"
          locale="en"
          @dayclick="dayClicked"
          :attributes="attrs"
          title-position="left"
          :rows="2"
        />


        <div class="table-wrapper">
          <div class="loaderGif" v-if="loader">
            <img  loading="lazy" src="../../assets/images/gif/load.gif" alt="gif" />
          </div>
          
          <Table
          @success="download"
            :key="componentKey"
            :itemLable="selectedDay?.ariaLabel"
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
    Table,
  },

  setup() {
    const componentKey = ref(0);

    return { componentKey };
  },

  methods: {

    download(){
        this.loader = false

       
    },
    dayClicked(day) {
      this.selectedDay = day;
      this.componentKey += this.selectedDay.day;
       this.loader = true;

      
    },
  },



   

  data() {
    return {
      selectedDay: { id: moment().format(), ariaLabel: moment().format("LL") }, // Add state to store selected day

      date: new Date(),
      dates: new Date(),
      loader: true,
      attrs: [
        {
          key: "today",

          highlight: true,
          dates: new Date(),
        },

        {
          dot: true,
          dates: [
            new Date(), // Jan 1st
          ],
        },

        {
          dot: true,
          dates: [
            new Date(), // Jan 1st
          ],
        },
        {
          dot: true,
          dates: [
            new Date(), // Jan 1st
          ],
        },
      ],
    };
  },
};
</script>