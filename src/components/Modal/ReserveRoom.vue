<template>
  <div class="modal-overlay">
    <div class="modal modal__rezerv" @click.stop>
      <div class="modal__head">
        <h6 class="modal__head-title">Otaq rezerv et</h6>
        <span class="modal__head-close" @click="close">
          <img
            loading="lazy"
            src="../../assets/images/svg/modalClose.svg"
            alt="modalClose"
          />
        </span>
      </div>
      <form class="modal__form" @submit.prevent="addPerson()">
        <div class="modal__form-group">
          <a-space direction="horizontal">
            <div>
              <label for="date" class="label">Tarix</label>
              <a-date-picker v-model:value="valueDate" id="date" @change="changeDate" />
            </div>
            <div>
              <label for="start-time" class="label">Başlama vaxtı</label>
              <a-time-picker
                 v-model:value="valueStartTime"
                 style="width: 100%"
                 @change="changeStartTime"
                 :disabledHours="getStartTimeDisabledHours"
                 :disabledMinutes="getStartTimeDisabledMinutes"
                 id="start-time"
                 format="HH:mm" />
            </div>
            <div>
              <label for="end-time" class="label">Bitmə vaxtı</label>
              <a-time-picker
                 v-model:value="valueEndTime"
                 style="width: 100%"
                 @change="changeEndTime"
                 :disabledHours="getEndTimeDisabledHours"
                 :disabledMinutes="getEndTimeDisabledMinutes"
                 id="end-time"
                 format="HH:mm" />
            </div>
          </a-space>
        </div>

        <div class="modal__form-group">
          <label for="select_room" class="label">Otağı seçin</label>
          <CustomSelect
            id="select_room"
            :options="getRoom"
            :default="room_id"
            @selectValue="chooseRoom"
            class="select"
          />

          <span
            class="errorText"
            v-for="error in v$.room_id.$errors"
            :key="error.$uid"
          >
            Otaq seşilməyib
          </span>
        </div>

        <div class="modal__form-group">
          <label for="user" class="label"
            >İclası təşkil edən şəxsin adı və soyadı</label
          >
          <input
            v-model.lazy="organizer_name"
            class="input input__100"
            id="user"
            type="text"
            maxlength="50"
          />

          <span
            class="errorText"
            v-for="error in v$.organizer_name.$errors"
            :key="error.$uid"
          >
            Təşkilatçı boş ola bilməz
          </span>
        </div>

        <div class="modal__form-group">
          <label for="options" class="label">Dəvət ediləcəklər ( To )</label>
          <a-select
              v-model:value="toValue"
              mode="tags"
              id="options"
              style="width: 100%"
              placeholder="İstifadəçi axtar"
              :options="options"
              @change="handleChangeTo"
          >
          </a-select>
          <span class="errorText" v-if="emailLengthValid === false">
            Dəvət ediləcəklər boş ola bilməz
          </span>
          <span class="errorText" v-if="toValue.length && emailLengthType === false">
            Maildə səhvlik var
          </span>
        </div>

        <div class="modal__form-group">
          <label for="optionsCC" class="label">Məlumat xarakterli dəvət ( CC )</label>
          <a-select
              v-model:value="ccValue"
              mode="tags"
              id="optionsCC"
              style="width: 100%"
              :disabled="ccStatus"
              placeholder="İstifadəçi axtar"
              :options="optionsCC"
              @change="handleChangeCC"
          >
          </a-select>

        </div>
        <div class="modal__form-group">
          <label for="title" class="label">Görüşün başlığı</label>
          <input
            class="input input__100"
            id="title"
            placeholder="Görüşün başlığı"
            type="text"
            maxlength="250"
            v-model.lazy="title"
          />
          <span
            class="errorText"
            v-for="error in v$.title.$errors"
            :key="error.$uid"
          >
            Görüşün başlığı boş ola bilməz
          </span>
        </div>

        <div class="modal__form-group">
          <label for="messg" class="label">Görüşlə bağlı qeydlər</label>
          <textarea
            class="input input__100 input__height"
            placeholder="Görüşlə bağlı qeydlər"
            id="messg"
            v-model.lazy="comment"
            style="background: none"
            maxlength="500"
          >
          </textarea>
        </div>

        <div class="modal__form-group modal__flex">
          <button
            aria-label="İmtina"
            type="button"
            class="submitWhite"
            @click="close"
          >
            Xeyr
          </button>

          <button
            aria-label="Yadda saxla"
            class="submit"
            type="submit"
            placeholder="Görüşlə bağlı qeydlər"
          >
            <span>Rezerv et</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <div v-show="clickLoad" class="loading-dots">
    <loading />
  </div>
</template>

<style lang="scss">
.disabled {
  pointer-events: none;
  background: rgb(204 204 204 / 38%);
}
.suggestions {
  list-style: none;
  padding: 0;
  margin: 0;
  position: absolute;
  left: 0;
  z-index: 5;
  background-color: white;
  width: 100%;
  max-height: 150px;
  overflow-y: auto;
}

.suggestions li {
  padding: 5px;
  cursor: pointer;
}

.suggestions li:hover {
  background-color: #f2f2f2;
}
.custom_tp {
  padding-bottom: 4px;
  border-bottom: 1px solid black;
  width: 100%;
  outline: none;
  font-size: 13px;
}
</style>

<script>
import moment from "moment";
import {TimePickerComponent} from "@syncfusion/ej2-vue-calendars";
import {onMounted} from "vue";
import {DatePicker} from "v-calendar";
import {useUserStore} from "@/stores/auth";
import {useReservationStore} from "@/stores/reservations";
import {useRoomStore} from "@/stores/room";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {storeToRefs} from "pinia";
import CustomSelect from "@/components/Modal/Dropdown.vue";
import Loading from "@/components/Loading.vue";
import {useSettingStore} from "@/stores/setting";

export default {
  components: {
    Loading,
    TimePickerComponent,
    CustomSelect,
    DatePicker,
  },

  data() {

    let date = new Date();

    let formatDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    let formatTime = date.getHours() + ':' + date.getMinutes();

    return {
      date: formatDate,
      valueDate: moment(formatDate, 'YYYY-MM-DD'),
      startTime: formatTime,
      valueStartTime: moment(formatTime, 'HH:mm'),
      endTime: formatTime,
      valueEndTime: moment(formatTime, 'HH:mm'),
      options: [],
      optionsCC: [],
      toValue: [],
      ccValue: [],
      room_id: "",
      organizer_name: "",
      emails: [],
      emailLengthValid: null,
      emailLengthType: null,
      title: "",
      comment: "",
      clickLoad: false,
      ccStatus: false,
      limit: 250,
      currentDateTime: new Date(),
      step: 10,
      inputText: "",
      suggestions: [
        "aliesso23@gmail.com",
        "energon28@gmail.com",
        "vasif@mail.ru",
        "kenan31@mail.ru",
      ],
      showSuggestions: false,
    };
  },

  validations() {
    return {
      date: { required },
      startTime: { required },
      endTime: { required },
      room_id: { required },
      organizer_name: { required },
      title: { required },
    };
  },

  methods: {
    handleChangeTo(value) {
      this.toValue.length > 0 ? this.emailLengthValid = true : this.emailLengthValid = false;
    },
    handleChangeCC(value) {
      console.log(`selected ${value}`);
    },
    getStartTimeDisabledHours(){
      let hours = [];
      for(let i =0; i < moment().hour(); i++){
        hours.push(i);
      }
      return hours;
    },
    getStartTimeDisabledMinutes(){
      let minutes = [];
      for(let i =0; i < moment().minute(); i++){
        minutes.push(i);
      }
      return minutes;
    },
    getEndTimeDisabledHours(){
      let hours = [];
      for(let i =0; i < this.valueStartTime.hour(); i++){
        hours.push(i);
      }
      return hours;
    },
    getEndTimeDisabledMinutes(){

      let hours = [];

      if (this.valueEndTime.hour() > this.valueStartTime.hour()) {
        return hours;
      }

      for(let i = 0; i < this.valueStartTime.minute(); i++){
        hours.push(i);
      }
      return hours;

    },
    changeDate(date, dateString) {
      this.date = dateString;
      this.valueDate = moment(new Date(dateString), 'YYYY-MM-DD');
      console.log(date);
    },
    changeStartTime(date, timeString) {
      this.startTime = timeString;
      this.endTime = timeString;
      this.valueEndTime = moment(timeString, 'HH:mm');
    },
    changeEndTime(date, timeString) {
      this.endTime = timeString;
      this.getEndTimeDisabledMinutes();
    },
    chooseRoom(event) {
      this.room_id = event.id;
    },
    addTag(event) {
      let room = this.getRoom.find((item) => item.id === this.room_id);
      if (room.capacity <= this.emails.length) return;

      let val = event.target.value.trim();

      if (this.emails.includes(val)) return;

      if (val.length > 0) {
        this.emails.push(val);
        event.target.value = "";
      }
      this.inputText = "";
      this.showSuggestions = false;
    },
    removeTag(index) {
      this.emails.splice(index, 1);
      this.emailLengthType = null;
    },
    removeLastTag(event) {
      if (event.target.value.length === 0) {
        this.removeTag(this.emails.length - 1);
      }
    },

    fetchData() {
      fetch(`/api/contacts`, {
        method: "GET",
        headers: {},
      })
          .then((response) => {
            response.json().then((data) => {
              console.log(data);

              data.map((item) => {
                this.options.push({ value: item });
                this.optionsCC.push({ value: item });
              });

            });
          })
          .catch((err) => {
            console.error(err);
          });
    },

    async addPerson() {

      if (this.toValue.length <= 0) this.emailLengthValid = false;
      if ((await this.v$.$validate()).valueOf() === false) return;
      if (this.emailLengthValid === false || this.emailLengthType === false)
        return;

      this.clickLoad = true;

      let formData = new FormData();

      formData.append("start_date", this.date);
      formData.append("start_time", this.startTime);
      formData.append("end_time", this.endTime);
      formData.append("room_id", this.room_id);
      formData.append("organizer_name", this.organizer_name);

      this.toValue.map((item) => {
        formData.append("emails[]", item);
      });

      this.ccValue.map((item) => {
        formData.append("cc_emails[]", item);
      });

      formData.append("title", this.title);
      formData.append("comment", this.comment);

      await this.userStore.createReservation(formData);

      if (!this.userStore.error && !this.userStore.errorMsg) {
        this.clickLoad = false;
        this.close();
        this.$toast.success(`Uğurla rezervasiya olundu`);
      }
      await this.useStoreRoom.fetchRoom();

      this.emitter.emit("refresh");

      if (this.userStore.errorMsg) {
        this.clickLoad = false;
        this.$toast.error(this.userStore.errorMsg);
      }

      if (this.userStore.error) this.clickLoad = false;
    },

    close() {
      this.userStore.errorMsg = "";
      this.userStore.error = [];
      this.$emit("close-modal");
    },
    handleInput() {
      this.showSuggestions = this.inputText.trim() !== "";
      this.userStore.searchContact(this.inputText);
    },
    selectSuggestion(suggestion) {
      this.emails.push(suggestion);
      this.inputText = "";
      this.showSuggestions = false;
    },
  },

  mounted() {

    const useSetting = useSettingStore();

    useSetting.getSetting.checked_invited === 1 ? this.ccStatus = false : this.ccStatus = true;

    this.fetchData();

    this.organizer_name = this.userstore.user.name;
  },

  setup() {
    onMounted(() => {
      userStore.fetchReservation();
      userstore.fetchUser();
    });

    const userstore = useUserStore();
    const userStore = useReservationStore();
    const useStoreRoom = useRoomStore();
    const { errors } = storeToRefs(userStore);
    return { userStore, userstore, useStoreRoom, errors, v$: useVuelidate() };
  },

  watch: {
    dateDifference(val) {
      if (val === true) {
        this.currentDateTime = new Date(2023, 1, 1, 0);
      } else {
        this.currentDateTime = new Date();
      }
    },
    emails: {
      handler() {
        this.emailLengthValid = this.toValue.length > 0;
        this.toValue.forEach((email) => {
          this.emailLengthType = !!email.match(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
        });
      },
      deep: true,
    },
  },

  computed: {
    dateDifference() {
      if (this.start_date && new Date()) {
        return this.start_date > new Date();
      }
    },
    getRoom() {
      return this.useStoreRoom.getRoom;
    },
    formattedTime() {
      return moment(this.start_time, "H:mm").format("HH:mm");
    },
    formattedDate() {
      return moment(this.start_date).format("YYYY-MM-DD");
    },
    formattedEndTime() {
      return moment(this.end_time, "H:mm").format("HH:mm");
    },
  },
};
</script>