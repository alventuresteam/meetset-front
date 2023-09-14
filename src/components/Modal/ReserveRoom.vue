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
          <DatePicker
            ref="datePicker"
            v-model="selectedDate"
            :popover="{ visibility: 'focus' }"
            :min-date="new Date()"
            :max-date="new Date(2030, 1, 4)"
            v-model.lazy="start_date"
          >
            <template #default="{ inputValue, inputEvents }">
              <input
                class="input"
                placeholder="Tarix"
                :value="inputValue"
                v-on="inputEvents"
              />
              <img
                @click="$refs.datePicker.togglePopover()"
                class="input-icon"
                src="../../assets/images/svg/calendar.svg"
              />
            </template>
          </DatePicker>

          <span
            class="errorText"
            v-for="error in v$.start_date.$errors"
            :key="error.$uid"
          >
            Vaxt təyin olunmayıb
          </span>
        </div>
        <div class="modal__flex modal__form-group" style="margin-bottom: 35px">
          <div class="input" style="margin-right: 12px">
            <div class="single-time-picker">
              <select class="custom_tp"   v-model="start_time">
                <option value="" disabled selected hidden>Başlama Saatı</option>
                <option v-for="time in times" :key="time" :value="time">
                  {{ time }}
                </option>
              </select>
            </div>
            <!-- <client-only>
              <time-picker-component
                v-model.lazy="start_time"
                id="startPicker"
                :change="onEnableEndTime"
                :step="step"
                :min="currentDateTime"
                :enabled="true"
                :readonly="startRead"
                placeholder="Başlama Saatı"
                :openOnFocus="true"
                :format="timeFormat"
                :value="startVal"
              ></time-picker-component>
            </client-only> -->
            <span
              style="margin-left: 5px"
              class="errorText"
              v-for="error in v$.start_time.$errors"
              :key="error.$uid"
            >
              Başlama vaxti boş ola bilməz
            </span>
          </div>
          <div class="input">
            <div class="single-time-picker">
              <select class="custom_tp"  v-model="end_time">
                <option value="" disabled selected hidden>Bitmə Saatı</option>
                <option v-for="time in endTimes" :key="time" :value="time">
                  {{ time }}
                </option>
              </select>
            </div>
            <!-- <client-only>
              <time-picker-component
                v-model.lazy="end_time"
                id="endPicker"
                placeholder="Bitmə Saatı"
                :enabled="true"
                :readonly="endRead"
                :min="min"
                :openOnFocus="true"
                :step="step"
                :format="timeFormat"
                :value="endVal"
                :change="changeValue"
              ></time-picker-component>
            </client-only> -->
            <span
              style="margin-left: 5px"
              class="errorText"
              v-for="error in v$.end_time.$errors"
              :key="error.$uid"
            >
              Bitmə vaxtı boş ola bilməz
            </span>
          </div>
        </div>

        <div class="modal__form-group">
          <CustomSelect
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
          <label for="emails" class="label"
            >Dəvət ediləcək şəxslərin mail ünvanları</label
          >
          <div
            :class="{ disabled: !room_id }"
            class="tag-input input input__100 input__height-auto"
          >
            <div
              v-for="(tag, index) in emails"
              :key="tag"
              class="tag-input__tag"
            >
              {{ tag }}
              <span @click="removeTag(index)">x</span>
            </div>

            <textarea
              maxlength="255"
              class="tag-input__text"
              @keydown.enter="addTag"
              @keydown.188="addTag"
              @keyup.space="addTag"
              @keydown.enter.prevent
              @keydown.delete="removeLastTag"
              @focusout="userStore.error = null"
              :disabled="emailLengthType === false"
              v-model="inputText"
              @input="handleInput"
            />
            <ul
              v-if="showSuggestions"
              :style="
                userStore.getContact.length ? 'border: 1px solid #ccc;' : ''
              "
              class="suggestions"
            >
              <li
                v-for="(suggestion, index) in userStore.getContact"
                :key="index"
                @click="selectSuggestion(suggestion)"
              >
                {{ suggestion }}
              </li>
            </ul>
          </div>

          <span class="errorText" v-if="emailLengthValid === false">
            Mail boş ola bilməz
          </span>

          <span
            class="errorText"
            v-if="emails.length && emailLengthType === false"
          >
            Maildə səhvlik var
          </span>
        </div>

        <div class="modal__form-group">
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
  border: unset;
  border-bottom: 1px solid black;
  width: 100%;
  outline: none;
  font-size: 13px;
}
</style>

<script>
import moment from "moment";
import { TimePickerComponent } from "@syncfusion/ej2-vue-calendars";
import { onMounted } from "vue";
import { DatePicker } from "v-calendar";
import { useUserStore } from "../../stores/auth";
import { useReservationStore } from "../../stores/reservations";
import { useRoomStore } from "../../stores/room";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { storeToRefs } from "pinia";
import CustomSelect from "@/components/Modal/Dropdown.vue";
import Loading from "@/components/Loading.vue";

export default {
  components: {
    Loading,
    TimePickerComponent,
    CustomSelect,
    DatePicker,
  },

  data() {
    return {
      selectedTime: "",
      datePickerOptions: {
        monthNames: [
          "Yanvar",
          "Fevral",
          "Mart",
          "Aprel",
          "May",
          "İyun",
          "İyul",
          "Avqust",
          "Sentyabr",
          "Oktyabr",
          "Noyabr",
          "Dekabr",
        ],
        dayNamesNarrow: ["Ba", "Ba.e", "Çə.a", "Çə", "Cü.a", "Cü", "Şə"],
        monthNamesShort: [
          "yan",
          "fev",
          "mart",
          "apr",
          "may",
          "iyun",
          "iyul",
          "avq",
          "sent",
          "okt",
          "noy",
          "dek",
        ],
      },
      start_date: new Date(),
      start_time: "",
      end_time: "",
      room_id: "",
      organizer_name: "",
      emails: [],
      emailLengthValid: null,
      emailLengthType: null,
      title: "",
      comment: "",
      clickLoad: false,

      limit: 250,
      currentDateTime: new Date(),
      selectedDate: new Date(),
      waterMark: "Saat",
      endEnable: false,
      startEnable: true,
      startRead: false,
      endRead: false,
      min: new Date(),
      isStartTimeChange: true,
      step: 10,
      startVal: null,
      endVal: null,
      timeFormat: "H:mm",
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
      start_date: { required },
      start_time: { required },
      end_time: { required },
      room_id: { required },
      organizer_name: { required },
      title: { required },
    };
  },

  methods: {
    chooseRoom(event) {
      this.room_id = event.id;
      // this.emails = [];
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

    async addPerson() {
      if (this.emails.length <= 0) this.emailLengthValid = false;
      if ((await this.v$.$validate()).valueOf() === false) return;
      if (this.emailLengthValid === false || this.emailLengthType === false)
        return;

      this.clickLoad = true;

      await this.userStore.createReservation(
        this.formattedDate,
        this.formattedTime,
        this.formattedEndTime,
        this.room_id,
        this.organizer_name,
        this.emails,
        this.title,
        this.comment
      );

      if (!this.userStore.error && !this.userStore.errorMsg) {
        this.clickLoad = false;
        this.close();
        this.$toast.success(`Uğurla rezerv  olundu`);
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

    changeValue: function (args) {
      this.endVal = args.value;
    },
    onEnableEndTime: function (args) {
      let value;
      if (this.isStartTimeChange) {
        this.endEnable = true;
        this.endVal = null;
        value = new Date(args.value);
        value.setMinutes(value.getMinutes() + this.step);
        this.min = value;
      } else {
        this.isStartTimeChange = true;
      }
    },
    handleInput() {
      if (this.inputText.trim() === "") {
        this.showSuggestions = false;
      } else {
        this.showSuggestions = true;
      }
      this.userStore.searchContact(this.inputText);
    },
    selectSuggestion(suggestion) {
      this.emails.push(suggestion);
      this.inputText = "";
      this.showSuggestions = false;
    },
  },

  mounted() {
    this.$refs.datePicker.$locale.monthNames = [
      ...this.datePickerOptions.monthNames,
    ];
    this.$refs.datePicker.$locale.dayNamesNarrow = [
      ...this.datePickerOptions.dayNamesNarrow,
    ];
    this.$refs.datePicker.$locale.monthNamesShort = [
      ...this.datePickerOptions.monthNamesShort,
    ];
    this.organizer_name = this.userstore.user.name;
  },

  setup() {
    onMounted(() => {
      userStore.fetchReservation();
      // userStore.searchContact();
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
    selectedTime(newValue) {
      this.$emit("input", newValue);
    },
    emails: {
      handler() {
        if (this.emails.length <= 0) {
          this.emailLengthValid = false;
        } else {
          this.emailLengthValid = true;
        }

        this.emails.forEach((email) => {
          if (
            email.match(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
          ) {
            this.emailLengthType = true;
          } else {
            this.emailLengthType = false;
          }
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
    filteredSuggestions() {
      return this.suggestions.filter(
        (suggestion) =>
          suggestion.toLowerCase().indexOf(this.inputText.toLowerCase()) !== -1
      );
    },
    times() {
      const timeOptions = [];
      const now = new Date();
      const currentDate = now.getDate();
      let currentHour = now.getHours();
      let currentMinute = now.getMinutes();
      if (currentDate !== this.selectedDate.getDate()) {
         currentHour = "0";
         currentMinute = "0";
      }

      for (let hour = currentHour; hour < 24; hour++) {
        const startMinute = hour === currentHour ? Math.ceil(currentMinute / 10) * 10 : 0;

        for (let minute = startMinute; minute < 60; minute += 10) {
          const formattedTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
          timeOptions.push(formattedTime);
        }
      }

      return timeOptions;
    },
    endTimes() {
      const timeOptions = [];
      const now = new Date();
      const currentDate = now.getDate();
      let currentHour = now.getHours();
      let currentMinute = now.getMinutes();
      if (currentDate !== this.selectedDate.getDate()) {
         currentHour = "0";
         currentMinute = "0";
      }

      for (let hour = currentHour; hour < 24; hour++) {
        const startMinute = hour === currentHour ? Math.ceil(currentMinute / 10) * 10 : 0;

        for (let minute = startMinute + 10; minute < 60; minute += 10) {
          const formattedTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
          timeOptions.push(formattedTime);
        }
      }

      return timeOptions;
    },
    startVal() {
      // Round the current time to the nearest 10-minute interval
      const currentMinute = this.currentDateTime.getMinutes();
      const roundedMinute = Math.ceil(currentMinute / 10) * 10;
      this.currentDateTime.setMinutes(roundedMinute);

      // Return the rounded time as the start value
      return this.currentDateTime;
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
