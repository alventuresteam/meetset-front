<template>
  <div class="modal-overlay">
    <div class="modal" @click.stop>
      <div class="modal__head">
        <h6 v-if="showDeleteButtons" class="modal__head-title">
          Otaq rezervasiyasını sil
        </h6>
        <h6 v-else-if="showEditButtons" class="modal__head-title">
          Otaq rezervasiyasını redaktə et
        </h6>
        <h6 v-else class="modal__head-title">
          Otaq rezervasiyasının detalları
        </h6>
        <span class="modal__head-close" @click="close">
          <img loading="lazy" src="../../assets/images/svg/modalClose.svg" alt="close_img"/>
        </span>
      </div>

      <div v-if="showDeleteButtons">
        <form class="modal__form" @submit.prevent="handleDelete(updateReservation)">
          <p class="modal__form-delete">Bu otaq rezervasiyasını silmək istədiyinizə əminsinizmi?</p>
          <div v-if="showDeleteButtons" class="modal__form-group modal__flex">
            <button type="button" class="submitWhite" @click="close" aria-label="Xeyr">
              <span>Xeyr</span>
            </button>
            <button type="submit" class="submitWhite" id="messg" aria-label="Bəli">
              <span>Bəli</span>
            </button>
          </div>
        </form>
      </div>

      <div v-else>
        <form class="modal__form" @submit.prevent="updateHandler">

          <div class="modal__form-group">
            <a-space direction="horizontal">
              <div>
                <label for="date" class="label">Tarix</label>
                <a-date-picker v-model:value="valueDate" :disabledDate="disabledDate" id="date" @change="changeDate" />
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
                :default="updateReservation.room_id"
                @selectValue="chooseRoom"
                class="select"/>
            <span class="errorText" v-for="error in v$.room_id.$errors" :key="error.$uid">Otaq seşilməyib</span>
          </div>

          <div class="modal__form-group">
            <label for="user" class="label">İclası təşkil edən şəxsin adı və soyadı</label>
            <input
                v-model.lazy="updateReservation.organizer_name"
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
                v-model:value="updateReservation.emails"
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
                v-model:value="updateReservation.cc_emails"
                mode="tags"
                id="optionsCC"
                style="width: 100%"
                :disabled="ccStatus"
                placeholder="İstifadəçi axtar"
                :options="cc_options"
                @change="handleChangeCC"
            >
            </a-select>

          </div>

          <div class="modal__form-group">
            <input class="input input__100" id="title" placeholder="Görüşün başlığı" type="text" maxlength="250" v-model.lazy="updateReservation.title"/>
            <span class="errorText" v-for="error in v$.title.$errors" :key="error.$uid">
              Görüşlə başlığı boş ola bilməz
            </span>
          </div>

          <div class="modal__form-group">
            <textarea class="input input__100 input__height" placeholder="Görüşlə bağlı qeydlər" style="background: none" v-model.lazy="updateReservation.comment" maxlength="500"/>
          </div>

          <div v-if="showEditButtons" class="modal__form-group modal__flex">
            <button type="button" class="submitWhite" aria-label="Silmək" @click="activeDelete">
              Sil
              <img loading="lazy" src="../../assets/images/svg/delet.svg" alt="delet"/>
            </button>
            <button type="submit" class="submit" id="messg" aria-label="Yadda Saxla">
              <span>Yadda saxla</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div v-show="clickLoad" class="loading-dots">
    <loading/>
  </div>
</template>
<script>
import Loading from "@/components/Loading.vue";
import {required} from "@vuelidate/validators";
import {useReservationStore} from "@/stores/reservations";
import {useRoomStore} from "@/stores/room";
import {useVuelidate} from "@vuelidate/core";
import moment from "moment/moment";
import CustomSelect from "@/components/Modal/Dropdown.vue";
import {useSettingStore} from "@/stores/setting";

export default {
  props: ["item", "itemRoom"],
  components: {
    CustomSelect,
    Loading,
  },
  data() {

    let date = new Date();

    let month = date.getMonth() + 1;
    let monthFormatted = month.toString().padStart(2, '0');
    let formatDate = date.getFullYear() + '-' + monthFormatted + '-' + date.getDate().toString().padStart(2, '0');
    let formatTime = date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');

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
      clickLoad: false,
      updateReservation: {},
      updateReservationRoom: {
        emails: [],
        cc_emails: [],
        title: "",
        comment: "",
        start_date: moment(formatDate, 'YYYY-MM-DD'),
        start_time: moment(formatTime, 'HH:mm'),
        end_time: moment(formatTime, 'HH:mm'),
      },
      showEditButtons: true,
      showDeleteButtons: false,
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
  mounted() {
    this.updateReservation = JSON.parse(JSON.stringify(this.item));
    Object.assign(this.updateReservationRoom, this.itemRoom);

    this.valueDate = moment(this.updateReservation.start_date, 'YYYY-MM-DD');
    this.valueStartTime = moment(this.updateReservation.start_time, 'HH:mm');
    this.valueEndTime = moment(this.updateReservation.end_time, 'HH:mm');

    const useSetting = useSettingStore();
    useSetting.getSetting.checked_invited === 1 ? this.ccStatus = false : this.ccStatus = true;

    console.log(this.itemRoom);
  },
  methods: {
    disabledDate(current) {
      return current < moment().subtract(1, 'days');
    },
    handleChangeTo(value) {
      this.toValue.length > 0 ? this.emailLengthValid = true : this.emailLengthValid = false;
    },
    handleChangeCC(value) {
      console.log(`selected ${value}`);
    },
    getStartTimeDisabledHours(){
      if (this.valueDate.format('YYYY-MM-DD') > moment().format('YYYY-MM-DD')) return;
      let hours = [];
      for(let i =0; i < moment().hour(); i++){
        hours.push(i);
      }
      return hours;
    },
    getStartTimeDisabledMinutes(){

      if (this.valueDate.format('YYYY-MM-DD') > moment().format('YYYY-MM-DD')) return;

      if (this.valueStartTime.hour() > moment().hour()) return;

      let minutes = [];
      for(let i =0; i < moment().minute(); i++){
        minutes.push(i);
      }
      return minutes;
    },
    getEndTimeDisabledHours(){

      if (this.valueDate.format('YYYY-MM-DD') > moment().format('YYYY-MM-DD')) return;

      let hours = [];
      for(let i =0; i < this.valueStartTime.hour(); i++){
        hours.push(i);
      }
      return hours;
    },
    getEndTimeDisabledMinutes(){

      if (this.valueDate.format('YYYY-MM-DD') > moment().format('YYYY-MM-DD')) return;

      if (this.valueStartTime.hour() > moment().hour()) return;

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
      this.getStartTimeDisabledMinutes();
    },
    changeEndTime(date, timeString) {
      this.endTime = timeString;
      this.getEndTimeDisabledMinutes();
    },
    close() {
      this.$emit("close-modal");
      this.userStore.errorMsg = "";
      this.userStore.error = [];
    },
    activeDelete() {
      this.showDeleteButtons = true;
      this.showEditButtons = false;
    },
    chooseRoom(event) {
      this.updateReservation.room_id = event.id;
    },
    async handleDelete(item) {

      this.clickLoad = true;
      await this.userStore.deletReservation(item);
      await this.useStoreRoom.fetchRoom();
      this.clickLoad = false;
      this.emitter.emit("refresh");
      this.close();
      this.$toast.success(`Uğurla silindi`);
    },
    async updateHandler(e) {
      this.clickLoad = true;

      this.updateReservation.start_time = this.startTime;
      this.updateReservation.end_time = this.endTime;

      await this.userStore.updateReservation(this.updateReservation);
      await this.useStoreRoom.fetchRoom();
      this.emitter.emit("refresh");

      if (this.userStore.errorMsg) {
        this.clickLoad = false;
        this.$toast.error(this.userStore.errorMsg);
      }

      if (
          !this.userStore.error &&
          !this.userStore.errorMsg &&
          this.showEditButtons
      ) {
        this.clickLoad = false;
        this.close();
        this.$toast.success(`Uğurla redaktə olundu`);
      }

      if (this.userStore.error) {
        this.clickLoad = false;
      }
    },
  },
  setup() {
    const userStore = useReservationStore();
    const useStoreRoom = useRoomStore();
    return {userStore, useStoreRoom, v$: useVuelidate()};
  },
  computed: {
    getRoom() {
      return this.useStoreRoom.getRoom;
    },
  }
}
</script>