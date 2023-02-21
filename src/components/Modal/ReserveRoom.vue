<template>
  <div class="modal-overlay">
    <div class="modal modal__rezerv" @click.stop>
      <div class="modal__head">
        <h6 class="modal__head-title">Otaq rezerv et</h6>
        <span class="modal__head-close" @click="$emit('close-modal')"
          ><img  loading="lazy" src="../../assets/images/svg/modalClose.svg" alt=""
        /></span>
      </div>
      <form class="modal__form" @submit.prevent="addPerson()">
        <div class="modal__form-group">
          <input
            id="date"
            class="input"
            placeholder="Tarix"
            v-model.lazy="start_date"
            onfocus="(this.type='date')"
            :min="minDate"
            @blur="onBlur"
          />

          <span class="errorText" v-if=" userStore.errorMsg">{{
            userStore.errorMsg
          }}</span>

          <span
            class="errorText"
            v-for="error in v$.start_date.$errors"
            :key="error.$uid"
          >
            vaxt təyin olunmayıb
          </span>
        </div>

        <div class="modal__flex modal__form-group">
          <div class="input" style="margin-right: 12px">
            <ejs-timepicker
              v-model.lazy="start_time"
              id="startPicker"
              :change="onEnableEndTime"
              :step="step"
              :enabled="startEnable"
              :readonly="startRead"
              :placeholder="waterMark"
              :openOnFocus="true"
              :format="timeFormat"
              :value="startVal"
            ></ejs-timepicker>

            <span
              class="errorText"
              v-for="error in v$.start_time.$errors"
              :key="error.$uid"
            >
              Başlama tarixi boş
            </span>
          </div>
          <div class="input">
            <ejs-timepicker
              v-model.lazy="end_time"
              id="endPicker"
              :placeholder="waterMark"
              :enabled="endEnable"
              :readonly="endRead"
              :min="min"
              :openOnFocus="true"
              :step="step"
              :format="timeFormat"
              :value="endVal"
              :change="changeValue"
            ></ejs-timepicker>

            <span
              class="errorText"
              v-for="error in v$.end_time.$errors"
              :key="error.$uid"
            >
              Bitmə tarixi boş
            </span>
          </div>
        </div>
        <div class="modal__form-group">
          <!-- <select
            style="margin-top: 20px"
            id="roomSelect"
            class="input input__100"
            v-model.lazy="room_id"
          >
            <option v-for="item in getRoom" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select> -->

          <!-- <pre>
            {{getRoom}}
          </pre> -->
             <CustomSelect
                :options="getRoom"
                :default="room_id" 
                @selectValue="room_id = $event.id"
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
          <label for="user" class="label">İclası təşkil edən şəxs</label>
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
            Təşkilatçı boşdu
          </span>
        </div>

        <div class="modal__form-group">
          <label for="emails" class="label">Dəvət ediləcəklər</label>

          <div class="tag-input input input__100 input__height-auto">
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
              @keydown.delete="removeLastTag"
            />
          </div>

       
        </div>

          <span class="errorText" v-if="userStore.error && userStore.error.emails">
            E-maildə səhvlik var
         </span>

         
          <span
            class="errorText"
            v-for="error in v$.checkEmails.$errors"
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
          </span>

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
            Görüşün başlığı boşdur
          </span>
        </div>

        <div class="modal__form-group">
          <textarea
            class="input input__100 input__height"
            placeholder="Görüşlə bağlı qeydlər"
            id="messg"
            v-model.lazy="comment"
            v-on:input="check"
          >
          </textarea>

          <span
            class="errorText"
            v-for="error in v$.comment.$errors"
            :key="error.$uid"
          >
            Görüşlə bağlı qeydlər boşdur
          </span>
        </div>

        <div class="modal__form-group modal__flex">
          <button
          aria-label="İmtina"
            type="button"
            class="submitWhite"
            @click="$emit('close-modal')"
          >
            İmtina
          </button>

          <button
          aria-label="Yadda saxla"
            class="submit"
            type="submit"
            placeholder="Görüşlə bağlı qeydlər"
            id="messg"
          >
          <div v-show="success" class="loading-dots">
  <h1 class="dot one">.</h1><h1 class="dot two">.</h1><h1 class="dot three">.</h1>
</div>
           <span v-show="!success">Yadda saxla</span>  
          </button>
        </div>

        <div v-show="success" class="success">
          <p>Rezerv uğurlu keçdi</p>
        </div>
      </form>
    </div>
  </div>
</template>



<script>
import moment from "moment";
import { TimePickerComponent } from "@syncfusion/ej2-vue-calendars";
import { onMounted } from "vue";
import { useReservationStore } from "../../stores/reservations";
import { useRoomStore } from "../../stores/room";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, helpers } from "@vuelidate/validators";
import { storeToRefs } from "pinia";
import CustomSelect from "@/components/Modal/Dropdown.vue";

export default {
  components: {
    "ejs-timepicker": TimePickerComponent,
    CustomSelect
  },

  data() {
    return {
      start_date: "",
      start_time: "",
      end_time: "",
      room_id: '',
      organizer_name: "",
      emails: [],
      checkEmails: [],
      title: "",
      comment: "",

      limit: 250,
      success: false,

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
    };
  },

  validations() {
    return {
      start_date: { required },
      start_time: { required },
      end_time: { required },
       room_id: { required },
      organizer_name: { required },
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
      title: { required },
      comment: { required },
    };
  },
  methods: {
    addTag(event) {
      event.preventDefault();
      let val = event.target.value.trim();
      if (val.length > 0) {
        if (this.emails.length >= 1) {
          for (let i = 0; i < this.emails.length; i++) {
            if (this.emails[i] === val) {
              return false;
            }
          }
        }
        this.emails.push(val);
        event.target.value = "";
      }
    },
    removeTag(index) {
      this.emails.splice(index, 1);
    },
    removeLastTag(event) {
      if (event.target.value.length === 0) {
        this.removeTag(this.emails.length - 1);
      }
    },

    async addPerson() {
    
      const result = await this.v$.$validate();
    this.checkEmails = this.emails.map((item) => {
        return {
          email: item,
        };
      });

      if (result) {

      
        await this.userStore.createReservation(
          this.start_date,
          this.formattedTime,
          this.formattedEndTime,
          this.room_id,
          this.organizer_name,
          this.emails,
          this.title,
          this.comment
        );
        await this.useStoreRoom.fetchRoom();
        this.emitter.emit("refresh");

setTimeout(() => {
    this.userStore.errorMsg = ''
        this.userStore.error = ''

}, 2000);

        if (!this.userStore.error  && !this.userStore.errorMsg) {
          this.success = true;

          if ((this.success = true)) {
            setTimeout(() => {
              this.$emit("close-modal");
              this.success = false;
            }, 1500);
          }
        }
      }
    },

    changeValue: function (args) {
      this.endVal = args.value;
    },
    onEnableEndTime: function (args) {
      /*Enables end time if start time is selected*/
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

    check() {
      this.comment = this.comment.substr(0, this.limit);
    },

    onBlur() {
      let today = new Date().toISOString().split("T")[0];
      if (this.start_date < today) {
        this.start_date = today;
        this.type = "text";
      }
    },
  },

  mounted() {
    let dtToday = new Date();

    let month = dtToday.getMonth() + 1;
    let day = dtToday.getDate(); 
    let year = dtToday.getFullYear();
    if (month < 10) month = "0" + month.toString();
    if (day < 10) day = "0" + day.toString();
    let maxDate = year + "-" + month + "-" + day;
    document.getElementById("date").setAttribute("min", maxDate);



const clearTime = document.getElementsByClassName('e-clear-icon-hide')
const clock =  document.getElementsByClassName('e-time-icon') 



  },

  setup() {
    onMounted(() => {
      userStore.fetchReservation();
    });

    const userStore = useReservationStore();
    const useStoreRoom = useRoomStore();

    const { errors } = storeToRefs(userStore);

    return { userStore, useStoreRoom, errors, v$: useVuelidate() };
  },

  computed: {
    minDate() {
      return new Date().toISOString().split("T")[0];
    },
    getRoom() {
      return this.useStoreRoom.getRoom;
    },

    formattedTime() {
      return moment(this.start_time, "H:mm").format("HH:mm");
    },

    formattedEndTime() {
      return moment(this.end_time, "H:mm").format("HH:mm");
    },
  },
};
</script>