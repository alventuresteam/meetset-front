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
                  :popover="{ visibility: 'focus' }"
                  :min-date="new Date()"
                  :max-date="new Date(2030, 1, 4)"
                  v-model.lazy="start_date"
               >
                  <template #default="{ inputValue, inputEvents }">
                     <input class="input " placeholder="Tarix" :value="inputValue" v-on="inputEvents"/>
                     <img @click="$refs.datePicker.togglePopover()" class='input-icon'
                          src="../../assets/images/svg/calendar.svg"/>
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
                  <ejs-timepicker
                     v-model.lazy="start_time"
                     id="startPicker"
                     :change="onEnableEndTime"
                     :step="step"
                     :min="currentDateTime"
                     :enabled="true"
                     :readonly="startRead"
                     :placeholder="waterMark"
                     :openOnFocus="true"
                     :format="timeFormat"
                     :value="startVal"
                  ></ejs-timepicker>

                  <span
                     style="margin-left: 5px;"
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
                     :enabled="true"
                     :readonly="endRead"
                     :min="min"
                     :openOnFocus="true"
                     :step="step"
                     :format="timeFormat"
                     :value="endVal"
                     :change="changeValue"
                  ></ejs-timepicker>

                  <span
                     style="margin-left: 5px;"
                     class="errorText"
                     v-for="error in v$.end_time.$errors"
                     :key="error.$uid"
                  >
              Bitmə tarixi boş ola bilməz
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
                     :disabled="!room_id"
                     maxlength="255"
                     class="tag-input__text"
                     @keydown.enter="addTag"
                     @keydown.188="addTag"
                     @keyup.space="addTag"
                     @keydown.delete="removeLastTag"
                  />
               </div>

               <span
                  class="errorText"
                  v-for="error in v$.checkEmails.$errors"
                  :key="error.$uid"
               >
                  <span v-if="error.$message === 'Value is not a valid email address'">E-mail yanlışdır</span>

                     <span
                        class="errorText"
                        v-if="error.$message === 'Value is required'"
                     >
                        Email boş ola bilməz
                     </span>

                     <p
                        class="errorText"
                        v-if="error.$message[0][0] === 'Value is not a valid email address'"
                     >
                        E-mail yanlışdır
                     </p>
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
            </div>

            <div class="modal__form-group modal__flex">
               <button
                  aria-label="İmtina"
                  type="button"
                  class="submitWhite"
                  @click="close"
               >
                  Xeyir
               </button>

               <button
                  aria-label="Yadda saxla"
                  class="submit"
                  type="submit"
                  placeholder="Görüşlə bağlı qeydlər"
                  id="messg"
               >
                  <span>Yadda saxla</span>
               </button>
            </div>
         </form>
      </div>
   </div>

   <div v-show="clickLoad" class="loading-dots">
      <loading/>
   </div>
</template>

<style>
.disabled {
   background: rgb(204 204 204 / 38%);
}
</style>

<script>
import moment from "moment";
import {TimePickerComponent} from "@syncfusion/ej2-vue-calendars";
import {onMounted} from "vue";
import {DatePicker} from "v-calendar";

import {useReservationStore} from "../../stores/reservations";
import {useRoomStore} from "../../stores/room";
import {useVuelidate} from "@vuelidate/core";
import {required, email, minLength, helpers} from "@vuelidate/validators";
import {storeToRefs} from "pinia";
import CustomSelect from "@/components/Modal/Dropdown.vue";
import Loading from "@/components/Loading.vue";
import {diffDates} from "@fullcalendar/core/internal";

export default {
   components: {
      Loading,
      "ejs-timepicker": TimePickerComponent,
      CustomSelect,
      DatePicker,
   },

   data() {
      return {
         datePickerOptions: {
            monthNames: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"],
            dayNamesNarrow: ["Ba", "Ba.e", "Çə.a", "Çə", "Cü.a", "Cü", "Şə"],
            monthNamesShort: ["yan", "fev", "mart", "apr", "may", "iyun", "iyul", "avq", "sent", "okt", "noy", "dek"],
         },
         start_date: "",
         start_time: "",
         end_time: "",
         room_id: "",
         organizer_name: "",
         emails: [],
         checkEmails: [],
         title: "",
         comment: "",
         clickLoad: false,

         limit: 250,
         currentDateTime: new Date(),

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
         start_date: {required},
         start_time: {required},
         end_time: {required},
         room_id: {required},
         organizer_name: {required},
         emails: {
            minLength: minLength(1),
            required,
            $each: helpers.forEach({
               // email: {
               //    required,
               //    email,
               // },
               required,
               email,
            }),
         },
         checkEmails: {
            minLength: minLength(1),
            required,
            $each: helpers.forEach({
               email: {
                  required,
                  email,
               },
            }),
         },
         title: {required},
         //   comment: { required },
      };
   },

   methods: {
      diffDates,
      chooseRoom(event) {
         this.room_id = event.id;
         this.emails = [];
      },


      addTag(event) {

         this.checkEmails = this.emails.map((item) => {
            return {
               email: item,
            };
         });

         let room = this.getRoom.find((item) => item.id === this.room_id);
         if (room.capacity <= this.emails.length) {
            return;
         }

         let val = event.target.value.trim();

         if (this.emails.includes(val)) {
            return;
         }

         if (val.length > 0) {
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
         // this.v$.emails.$touch();

         // if (this.v$.$invalid) {
         //    this.$toast.error('Заполните обязательные поля!');
         // return
         // }

         const result = await this.v$.$validate();
         this.checkEmails = this.emails.map((item) => {
            return {
               email: item,
            };
         });

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
         await this.useStoreRoom.fetchRoom();
         this.emitter.emit("refresh");

         if(this.userStore.errorMsg){
            this.clickLoad = false;


            this.$toast.error(this.userStore.errorMsg);

         }

         if (this.userStore.error  ) {
            this.clickLoad = false;
         }

         if (!this.userStore.error && !this.userStore.errorMsg) {
            this.clickLoad = false;
            this.close()
            this.$toast.success(`Rezerv uğurlu keçdi`);
         }
      },

      close(){
         this.userStore.errorMsg = "";
         this.userStore.error = [];
         this.$emit("close-modal");

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
      this.$refs.datePicker.$locale.monthNames = [...this.datePickerOptions.monthNames];
      this.$refs.datePicker.$locale.dayNamesNarrow = [...this.datePickerOptions.dayNamesNarrow];
      this.$refs.datePicker.$locale.monthNamesShort = [...this.datePickerOptions.monthNamesShort];
   },

   setup() {
      onMounted(() => {
         userStore.fetchReservation();
      });

      const userStore = useReservationStore();
      const useStoreRoom = useRoomStore();

      const {errors} = storeToRefs(userStore);

      return {userStore, useStoreRoom, errors, v$: useVuelidate()};
   },

   watch: {
      dateDifference(val) {
         if (val === true) {
            this.currentDateTime = new Date(2023, 1, 1, 0);
         } else {
            this.currentDateTime = new Date();
         }
      }
   },

   computed: {
      dateDifference() {
         if (this.start_date && new Date()) {
            return this.start_date > new Date();
         }
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
         return moment(this.start_date,).format('YYYY-MM-DD');
      },

      formattedEndTime() {
         return moment(this.end_time, "H:mm").format("HH:mm");
      },
   },
};
</script>
