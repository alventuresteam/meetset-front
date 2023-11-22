<template>
  <a-space direction="horizontal" style="width: 100%; margin-bottom: 20px">
    <a-date-picker v-model:value="valueDate" @change="dayClicked"/>
  </a-space>
  <div class="calendar calendar-admin">
    <div class="container-fluid">
      <div class="table-wrapper">
        <div class="loading-dots" v-if="loader">
          <loading/>
        </div>

        <Table :key="componentKey"
               :itemLable="formattedDate"
               :itemDate="selectedDay?.id"
               @success="download"/>
      </div>
    </div>
  </div>
</template>

<script>
import {ref} from "vue";
import moment from "moment";
import az from 'moment/locale/az'
import Table from "./CalendarTable.vue";
import Loading from "@/components/Loading.vue";
import {Calendar, DatePicker} from "v-calendar";
import CalendarHeader from "./CalendarHeader.vue";

export default {
  components: {
    Loading,
    Calendar,
    DatePicker,
    CalendarHeader,
    Table,
  },
  data() {

    let date = new Date();

    let formatDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    return {
      calendarDate: formatDate,
      valueDate: moment(formatDate, 'YYYY-MM-DD'),
      datePickerOptions: {
        monthNames: ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avqust", "sentyabr", "oktyabr", "noyabr", "dekabr"],
        monthNamesShort: ["yan", "fev", "mart", "apr", "may", "iyun", "iyul", "avq", "sent", "okt", "noy", "dek"],
        dayNamesNarrow: ["Ba", "Ba.e", "Çə.a", "Çə", "Cü.a", "Cü", "Şə"]
      },
      selectedDay: {
        id: moment().format(),
        ariaLabel: moment().format("LL")
      },
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
            moment().format("LL"),
          ],
        },
        {
          dot: true,
          dates: [
            moment().format("LL"),
          ],
        },
        {
          dot: true,
          dates: [
            moment().format("LL"),
          ],
        },
      ],
      azWeeks: ['B.E', 'Ç.A', 'ÇƏR', 'C.A', 'CÜM', 'ŞƏN', 'BAZ'],
      azMonths: ['yan', 'fev', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avg', 'sent', 'okt', 'noy', 'dek']
    };
  },
  setup() {
    const componentKey = ref(0);

    return {componentKey};
  },
  methods: {
    datePickerMonth() {
      const datePicker = document.querySelectorAll('.v-calendarAll .vc-pane-container .vc-title');

      datePicker.forEach(item => {
        if (item.textContent.split(' ')[0] === 'январь') item.textContent = `Yanvar ${item.textContent.split(' ')[1]}`;
        if (item.textContent.split(' ')[0] === 'февраль') item.textContent = `Fevral ${item.textContent.split(' ')[1]}`;
        if (item.textContent.split(' ')[0] === 'март') item.textContent = `Mart ${item.textContent.split(' ')[1]}`;
        if (item.textContent.split(' ')[0] === 'апрель') item.textContent = `Aprel ${item.textContent.split(' ')[1]}`;
        if (item.textContent.split(' ')[0] === 'май') item.textContent = `May ${item.textContent.split(' ')[1]}`;
        if (item.textContent.split(' ')[0] === 'июнь') item.textContent = `Iyun ${item.textContent.split(' ')[1]}`;
        if (item.textContent.split(' ')[0] === 'июль') item.textContent = `Iyul ${item.textContent.split(' ')[1]}`;
        if (item.textContent.split(' ')[0] === 'август') item.textContent = `Avgust ${item.textContent.split(' ')[1]}`;
        if (item.textContent.split(' ')[0] === 'сентябрь') item.textContent = `Sentyabr ${item.textContent.split(' ')[1]}`;
        if (item.textContent.split(' ')[0] === 'октябрь') item.textContent = `Oktyabr ${item.textContent.split(' ')[1]}`;
        if (item.textContent.split(' ')[0] === 'ноябрь') item.textContent = `Noyabr ${item.textContent.split(' ')[1]}`;
        if (item.textContent.split(' ')[0] === 'декабрь') item.textContent = `Dekabr ${item.textContent.split(' ')[1]}`;
      })
      //this.datePickerDay();
    },
    datePickerMonthDropdown() {
      const datePickerTitles = document.querySelectorAll('.vc-pane .vc-title');
      const months = document.querySelectorAll('.vc-popover-content-wrapper');

      datePickerTitles.forEach(title => {
        title.addEventListener('click', () => {
          months.forEach(month => {
            [...month.querySelectorAll('.vc-nav-item')].forEach((item, i) => {
              item.textContent = this.azMonths[i];
            })
          })
        })
      })
    },
    // datePickerDay() {
    //   const datePicker1 = document.querySelectorAll('.v-calendarAll .vc-pane')[0].querySelectorAll('.vc-weekday');
    //   const datePicker2 = document.querySelectorAll('.v-calendarAll .vc-pane')[1].querySelectorAll('.vc-weekday');
    //
    //   datePicker1.forEach((item, i) => {
    //     item.textContent = this.azWeeks[i];
    //     item.classList.add('active');
    //   });
    //
    //   datePicker2.forEach((item, i) => {
    //     item.textContent = this.azWeeks[i];
    //     item.classList.add('active');
    //   });
    // },
    download() {
      this.loader = false
    },
    dayClicked(date, dateString) {
      this.date = dateString;
      this.calendarDate = dateString;
      this.valueDate = moment(new Date(dateString), 'YYYY-MM-DD');

      this.selectedDay = this.date;
      this.componentKey += this.selectedDay.day;
      this.loader = true;
    },
  },
  mounted() {

    if (this.loader) {
      document.getElementById("app").style.overflow = 'hidden'
    }

    const vcArrows = document.querySelectorAll('.vc-pane-container .vc-arrow');

    vcArrows.forEach(btn => {
      btn.addEventListener('click', () => {
        this.datePickerMonth();
      })
    })
  },
  computed: {
    formattedDate() {
      moment.updateLocale('az', {
        months: [
          "Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul",
          "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
        ]
      });

      return moment(this.valueDate).lang('az').format("MMMM Do, YYYY");
    }
  }
}
</script>