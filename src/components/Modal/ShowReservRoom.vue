<template>
    <div class="modal-overlay">
        <div class="modal" @click.stop>
            <div class="modal__head">
                
                <h6 v-if="showDeletButtons" class="modal__head-title">Otaq rezervasiyasını sil</h6>

                <h6 v-else-if="showEditButtons" class="modal__head-title">Otaq rezervasiyasını redaktə et</h6>

                <h6 v-else class="modal__head-title">Otaq rezervasiyasının detalları</h6>

                <span class="modal__head-close" @click="$emit('close-modal')">
                    <img
                        loading="lazy"
                        src="../../assets/images/svg/modalClose.svg"
                        alt="close_img"
                    />
                </span>
            </div>

            <form class="modal__form" @submit.prevent="uppdateHandler">
                <div v-if="showDeletButtons">
                    <p class="modal__form-delete">
                        Bu otaq rezervasiyasını silmək istədiyinizə əminsiniz?
                    </p>
                </div>

                <div v-else>
                    <div class="modal__form-group">
                        <DatePicker
                            :popover="{ visibility: 'focus' }"
                            :min-date="new Date()"
                            :max-date="new Date(2030, 1, 4)"
                            v-model.lazy="updateReservation.start_date"
                        >
                            <template #default="{ inputValue, inputEvents }">
                                <input class="input " placeholder="Tarix" :value="inputValue" v-on="inputEvents"/>
                                <img class='input-icon' src="../../assets/images/svg/calendar.svg"/>
                            </template>
                        </DatePicker>

                        <span class="errorText" v-if="userStore.errorMsg">
                            {{ userStore.errorMsg }}
                        </span>

                        <span
                            class="errorText"
                            v-for="error in v$.updateReservation.start_date.$errors"
                            :key="error.$uid"
                        >
                          {{ error.$message }}
                        </span>
                    </div>

                    <div class="modal__flex modal__form-group" style="margin-bottom: 35px">
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


                        <CustomSelect
                            :options="useStoreRoom.getRoom"
                            :default="updateReservation.room_id"
                            class="select"
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
                                v-for="(tag, index) in updateReservation.emails"
                                :key="tag"
                                class="tag-input__tag"
                            >
                                {{ tag }}
                                <button
                                    aria-label="x"
                                    @click="removeTag(index)"
                                >
                                    x
                                </button>
                            </div>

                            <textarea
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


                        </div>
                    </div>

                    <div class="modal__form-group">
                        <input
                            class="input input__100"
                            id="title"
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
                v-model.lazy="updateReservation.comment"
            />

                        <!-- <span
                          class="errorText"
                          v-for="error in v$.updateReservation.comment.$errors"
                          :key="error.$uid"
                        >
                          Görüşlə bağlı qeydlər boşdur
                        </span> -->
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
                        <span>Yadda saxla</span>
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
                        <span>Sil</span>
                        <img
                            loading="lazy"
                            src="../../assets/images/svg/delet.svg"
                            alt="delet"
                        />
                    </button>
                </div>

                <div v-show="clickLoad" class="loading-dots">
                    <img
                        class="animationLoad"
                        loading="lazy"
                        src="../../assets/images/gif/load.svg"
                        alt="gif"
                    />
                </div>
            </form>


        </div>
    </div>
</template>

<script>
import {useReservationStore} from "../../stores/reservations";
import {useRoomStore} from "../../stores/room";
import {TimePickerComponent} from "@syncfusion/ej2-vue-calendars";
import moment from "moment";
import {useVuelidate} from "@vuelidate/core";
import {required, email, minLength, helpers} from "@vuelidate/validators";
import CustomSelect from "@/components/Modal/Dropdown.vue";
import {DatePicker} from "v-calendar";

export default {
    props: ["item", "itemRoom"],
    components: {
        "ejs-timepicker": TimePickerComponent,
        CustomSelect,
        DatePicker,

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
                end_time: {required},
                start_time: {required},
                organizer_name: {required},
                start_date: {required},
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
                room_id: {required},
                title: {required},
                // comment: { required },
            },
        };
    },

    mounted() {
        this.updateReservation = JSON.parse(JSON.stringify(this.item));
        //Object.assign(this.updateReservation, this.item);
        Object.assign(this.updateReservationRoom, this.itemRoom);

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

        activeDelet() {
            this.showDeletButtons = true;
            this.showEditButtons = false;

        },


        async handleDelete(item) {
            this.clickLoad = true;
            await this.userStore.deletReservation(item);
            await this.useStoreRoom.fetchRoom();


            if (this.userStore.error || this.userStore.errorMsg) {
                this.clickLoad = false;
            }

            if (!this.userStore.error && !this.userStore.errorMsg) {
                this.clickLoad = false;

                this.emitter.emit("refresh");
                this.$emit("close-modal");

                this.$toast.success(`Uğurla silindi`);
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
                this.clickLoad = true;

                this.updateReservation.start_date = this.formattedDate;

                this.updateReservation.start_time = this.formattedTime;
                this.updateReservation.end_time = this.formattedEndTime;

                await this.userStore.updateReservation(this.updateReservation);
                await this.useStoreRoom.fetchRoom();

                if (this.userStore.error || this.userStore.errorMsg) {
                    this.clickLoad = false;
                }

                if (!this.userStore.error && !this.userStore.errorMsg) {
                    this.clickLoad = false;
                    this.userStore.errorMsg = "";
                    this.userStore.error = "";
                    this.emitter.emit("refresh");
                    this.$toast.success(`Uğurlu redaktə edildi`);
                    this.$emit("close-modal");
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
        return {userStore, useStoreRoom, v$: useVuelidate()};
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
        formattedDate() {
            return moment(this.updateReservation.start_date,).format('YYYY-MM-DD');
        },

        formattedEndTime() {
            return moment(this.updateReservation.end_time, "H:mm").format("HH:mm");
        },
    },
};
</script>

