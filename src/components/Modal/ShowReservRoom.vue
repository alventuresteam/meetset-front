<template>
  <div class="modal-overlay">
    <div
      :class="showDeletButtons ? 'modal modal__remove' : 'modal modal__rezerv'"
      @click.stop
    >
      <div class="modal__head">
        <h6 v-if="showDeletButtons" class="modal__head-title">
          Otaq rezervasiyasını sil
        </h6>

        <h6 v-else-if="showEditButtons" class="modal__head-title">
          Otaq rezervasiyasını redaktə et
        </h6>

        <h6 v-else class="modal__head-title">
          Otaq rezervasiyasının detalları
        </h6>

        <span class="modal__head-close" @click="$emit('close-modal')"
          ><img
            loading="lazy"
            src="../../assets/images/svg/modalClose.svg"
            alt=""
        /></span>
      </div>
      <form action="" class="modal__form" @submit.prevent="uppdateHandler">
        <div v-if="showDeletButtons">
          <p class="modal__form-delete">
            Bu otaq rezervasiyasını silmək istədiyinizə əminsiniz?
          </p>
        </div>
        <div v-else>
          <div class="modal__form-group">
            <input
              :disabled="disabled == 1"
              id="date"
              type="date"
              class="input"
              placeholder="Tarix"
              v-model.lazy="updateReservation.start_date"
              onfocus="(this.type='date')"
              @blur="onBlur"
              :min="minDate"
            />
            <span class="errorText" v-if="userStore.errorMsg">{{
              userStore.errorMsg
            }}</span>
            <span
              class="errorText"
              v-for="error in v$.updateReservation.start_date.$errors"
              :key="error.$uid"
            >
              {{ error.$message }}
            </span>
          </div>

          <div class="modal__flex modal__form-group">
            <div class="input" style="margin-right: 10px">
              <ejs-timepicker
                v-model.lazy="updateReservation.start_time"
                id="startPicker"
                :change="onEnableEndTime"
                :enabled="true"
                :openOnFocus="true"
                :readonly="startRead"
                :placeholder="waterMark"
                :format="timeFormat"
                :value="startVal"
                :step="step"
              ></ejs-timepicker>

              <span
                class="errorText"
                v-for="error in v$.updateReservation.start_time.$errors"
                :key="error.$uid"
              >
                Başlama tarixi boş
              </span>
            </div>

            <div class="input">
              <ejs-timepicker
                v-model.lazy="updateReservation.end_time"
                id="endPicker"
                :placeholder="waterMark"
                :enabled="true"
                :openOnFocus="true"
                :readonly="endRead"
                :min="min"
                :step="step"
                :format="timeFormat"
                :value="endVal"
                :change="changeValue"
              ></ejs-timepicker>

              <span
                class="errorText"
                v-for="error in v$.updateReservation.end_time.$errors"
                :key="error.$uid"
              >
                Bitmə tarixi boş
              </span>
            </div>
          </div>

          <div class="modal__form-group">
            <!-- <select
              id="roomSelect"
              :disabled="disabled == 1"
              class="input input__100"
              v-model.lazy="updateReservation.room_id"
            >
              <option
                v-for="item in useStoreRoom.getRoom"
                :key="item.id"
                :value="item.id"
              >
                {{ item.name }}
              </option>
            </select> -->


             <CustomSelect
                :options="useStoreRoom.getRoom"
                :default="updateReservation.room_id"
                class="select"


                :class="disabled == 1 ?  'customDisable' : ''"
                @selectValue="chooseRoom"

            />

            <span
              class="errorText"
              v-for="error in v$.updateReservation.room_id.$errors"
              :key="error.$uid"
            >
              Otaq boşdur
            </span>
          </div>

          <div class="modal__form-group">
            <label for="user" class="label">İclası təşkil edən şəxs</label>
            <input
              :disabled="disabled == 1"
              v-model.lazy="updateReservation.organizer_name"
              class="input input__100"
              id="user"
              type="text"
              maxlength="250"
            />

            <span
              class="errorText"
              v-for="error in v$.updateReservation.organizer_name.$errors"
              :key="error.$uid"
            >
              İclası təşkil edən şəxs boşdur
            </span>
          </div>

          <div class="modal__form-group">
            <label for="emails" class="label">Dəvət ediləcəklər</label>

            <div class="tag-input input input__100 input__height-auto">
              <div
                :disabled="disabled == 1"
                v-for="(tag, index) in updateReservation.emails"
                :key="tag"
                class="tag-input__tag"
              >
                {{ tag }}
                <button
                  aria-label="x"
                  :disabled="disabled == 1"
                  @click="removeTag(index)"
                >
                  x
                </button>
              </div>

              <textarea
                :disabled="disabled == 1"
                class="tag-input__text"
                maxlength="50"
                @keydown.enter="addTag"
                @keydown.188="addTag"
                @keyup.space="addTag"
                @keydown.delete="removeLastTag"
              />

              <span
                class="errorText"
                v-if="userStore.error && userStore.error.emails"
              >
                E-maildə səhvlik var
              </span>

              <!-- <span
                class="errorText"
                v-for="error in v$.updateReservation.checkEmails.$errors"
                :key="error.$uid"
              >
                <template v-for="err in error.$message">
                  {{ err[0] === "Value is required" ? "Email boşdur" : "" }}

                  {{
                    err[0] === "Value is not a valid email address"
                      ? "Burda email olmalıdır!"
                      : ""
                  }}
                </template>
              </span> -->
            </div>
          </div>

          <div class="modal__form-group">
            <input
              class="input input__100"
              id="title"
              :disabled="disabled == 1"
              placeholder="Görüşün başlığı"
              type="text"
              maxlength="250"
              v-model.lazy="updateReservation.title"
            />

            <span
              class="errorText"
              v-for="error in v$.updateReservation.title.$errors"
              :key="error.$uid"
            >
              Görüşlə başlığı boşdur
            </span>
          </div>

          <div class="modal__form-group">
            <textarea
              class="input input__100 input__height"
              placeholder="Görüşlə bağlı qeydlər"
              id="messg"
              :disabled="disabled == 1"
              v-model.lazy="updateReservation.comment"
              v-on:input="check"
            />

            <span
              class="errorText"
              v-for="error in v$.updateReservation.comment.$errors"
              :key="error.$uid"
            >
              Görüşlə bağlı qeydlər boşdur
            </span>
          </div>
        </div>

        <div v-if="showEditButtons" class="modal__form-group modal__flex">
          <button
            type="button"
            class="submitWhite"
            aria-label="Silmək"
            @click="activeDelet"
          >
            Sil
            <img
              loading="lazy"
              src="../../assets/images/svg/delet.svg"
              alt="delet"
            />
          </button>
          <button
            type="submit"
            class="submit"
            @click="uppdateHandler"
            id="messg"
            aria-label="Yadda Saxla"
          >
            <div v-show="clickLoad" class="loading-dots">
              <h1 class="dot one">.</h1>
              <h1 class="dot two">.</h1>
              <h1 class="dot three">.</h1>
            </div>
            <span v-show="!clickLoad">Yadda saxla</span>
          </button>
        </div>

        <div v-else-if="showDeletButtons" class="modal__form-group modal__flex">
          <button
            type="button"
            class="submitWhite"
            @click="$emit('close-modal')"
            aria-label="Imtina et"
          >
            Imtina et
          </button>

          <button
            @click="handleDelete(updateReservation)"
            type="submit"
            class="submitWhite"
            id="messg"
            aria-label="Sil"
          >
            <div v-show="clickLoad" class="loading-dots">
              <h1 class="dot one">.</h1>
              <h1 class="dot two">.</h1>
              <h1 class="dot three">.</h1>
            </div>
            <span v-show="!clickLoad">Sil</span>
            <img
              loading="lazy"
              src="../../assets/images/svg/delet.svg"
              alt="delet"
            />
          </button>
        </div>

        <div v-else class="modal__form-group modal__flex">
          <button
            type="button"
            class="submitWhite"
            aria-label="Silmək"
            @click="activeDelet"
          >
            Silmək
            <img
              loading="lazy"
              src="../../assets/images/svg/delet.svg"
              alt="delet"
            />
          </button>

          <button
            type="button"
            class="submitWhite"
            aria-label="Redaktə et"
            id="messg"
            @click="activeDisable()"
          >
            Redaktə et
            <img
              loading="lazy"
              src="../../assets/images/svg/edit.svg"
              alt="edit"
            />
          </button>
        </div>

        <div v-if="success && showEditButtons" class="success">
          <p>Uğurlu redaktə edildi</p>
        </div>

        <div v-if="success && showDeletButtons" class="success">
          <p>Uğurla silindi</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useReservationStore } from "../../stores/reservations";
import { useRoomStore } from "../../stores/room";
import { TimePickerComponent } from "@syncfusion/ej2-vue-calendars";
import moment from "moment";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, helpers } from "@vuelidate/validators";
import CustomSelect from "@/components/Modal/Dropdown.vue";

export default {
  props: ["item", "itemRoom"],
  components: {
    "ejs-timepicker": TimePickerComponent,
    CustomSelect,
  },
  data() {
    return {
      clickLoad: false,

      updateReservation: {},
      updateReservationRoom: {},
      showEditButtons: true,
      showDeletButtons: false,
      timeFormat: "HH:mm",
      limit: 250,
      disabled: 0,
      success: false,
      waterMark: "Saat",

      endEnable: false,
      startEnable: false,
      startRead: false,
      endRead: false,
      min: new Date(),
      isStartTimeChange: true,
      step: 10,
      startVal: null,
      endVal: null,
    };
  },

  validations() {
    return {
      updateReservation: {
        end_time: { required },
        start_time: { required },
        organizer_name: { required },
        start_date: { required },
        emails: {
          minLength: minLength(1),
          $each: helpers.forEach({
            required,
            email,
          }),
        },
        checkEmails: {
          minLength: minLength(1),
          $each: helpers.forEach({
            email: {
              required,
              email,
            },
          }),
        },
        room_id: { required },
        title: { required },
        comment: { required },
      },
    };
  },

  mounted() {
    this.updateReservation = JSON.parse(JSON.stringify(this.item));
    //Object.assign(this.updateReservation, this.item);
    Object.assign(this.updateReservationRoom, this.itemRoom);

    let dtToday = new Date();

    let month = dtToday.getMonth() + 1;
    let day = dtToday.getDate();
    let year = dtToday.getFullYear();
    if (month < 10) month = "0" + month.toString();
    if (day < 10) day = "0" + day.toString();
    let maxDate = year + "-" + month + "-" + day;
    document.getElementById("date").setAttribute("min", maxDate);
  },
  methods: {
    chooseRoom(event) {
      this.updateReservation.room_id = event.id;
      this.updateReservation.emails = [];
    },
    addTag(event) {
      let room = this.getRoom.find(
        (item) => item.id === this.updateReservation.room_id
      );

      if (room.capacity <= this.updateReservation.emails.length) {
        return;
      }

      let val = event.target.value.trim();

      if (this.updateReservation.emails.includes(val)) {
        return;
      }
      event.preventDefault();
      if (val.length > 0) {
        this.updateReservation.emails.push(val);
        event.target.value = "";
      }
    },
    removeTag(index) {
      this.updateReservation.emails.splice(index, 1);
    },
    removeLastTag(event) {
      if (event.target.value.length === 0) {
        this.removeTag(this.updateReservation.emails.length - 1);
      }
    },

    activeDisable() {
      this.showEditButtons = true;
      this.disabled = 0;
      this.startEnable = true;
    },

    activeDelet() {
      this.showDeletButtons = true;
    },

    unActiveDelet() {
      this.showDeletButtons = false;
    },

    check() {
      this.updateReservation.comment = this.updateReservation.comment.substr(
        0,
        this.limit
      );
    },

    onBlur() {
      let today = new Date().toISOString().split("T")[0];
      if (this.updateReservation.start_date < today) {
        this.updateReservation.start_date = today;
        this.type = "text";
      }
    },

    Disable() {
      this.showEditButtons = false;
      this.disabled = 1;
      this.startEnable = false;
    },
    async handleDelete(item) {
      await this.userStore.deletReservation(item);
      await this.useStoreRoom.fetchRoom();
      this.success = true;
      if ((this.success = true)) {
        this.emitter.emit("refresh");
        setTimeout(() => {
          this.success = false;
          this.$emit("close-modal");
        }, 1500);
      }
    },

    async uppdateHandler(e) {
      const result = await this.v$.$validate();
      this.updateReservation.checkEmails = this.updateReservation.emails.map(
        (item) => {
          return {
            email: item,
          };
        }
      );

      if (result) {
        this.updateReservation.start_time = this.formattedTime;
        this.updateReservation.end_time = this.formattedEndTime;

        await this.userStore.updateReservation(this.updateReservation);
        await this.useStoreRoom.fetchRoom();

        setTimeout(() => {
          this.userStore.errorMsg = "";
          this.userStore.error = "";
        }, 1500);

        if (!this.userStore.error && !this.userStore.errorMsg) {
          this.success = true;
          this.clickLoad = true;

          if ((this.success = true)) {
            setTimeout(() => {
              this.$emit("close-modal");
              this.success = false;
              this.emitter.emit("refresh");
              this.clickLoad = false;
            }, 1500);
          }
        }
      }
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
  },

  setup() {
    const userStore = useReservationStore();
    const useStoreRoom = useRoomStore();

    return { userStore, useStoreRoom, v$: useVuelidate() };
  },

  computed: {
    getRoom() {
      return this.useStoreRoom.getRoom;
    },
    minDate() {
      return new Date().toISOString().split("T")[0];
    },
    formattedTime() {
      return moment(this.updateReservation.start_time, "H:mm").format("HH:mm");
    },

    formattedEndTime() {
      return moment(this.updateReservation.end_time, "H:mm").format("HH:mm");
    },
  },
};
</script>

<style>
.customDisable {
  pointer-events: none;
  opacity: 0.4;
}
</style>
