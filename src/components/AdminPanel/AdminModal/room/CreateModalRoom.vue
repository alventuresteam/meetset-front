<template>
  <div class="modal-overlay">
    <div class="modal modal__room" @click.stop>
      <div class="modal__head">
        <h6 class="modal__head-title">Otaq əlavə et</h6>
        <span class="modal__head-close" @click="$emit('close-modal')"
          ><img  loading="lazy" src="../../../../assets/images/svg/modalClose.svg" alt=""
        /></span>
      </div>

      <form action="" class="modal__form" @submit.prevent="addRoom">
        <div class="modal__form-group">
          <input
            class="input input__100"
            placeholder="Otağın adı"
            maxlength="30"
            type="text"
            v-model.lazy="name"
          />

          <span
            class="errorText"
            v-for="error in v$.name.$errors"
            :key="error.$uid"
          >
            Ad boşdu
          </span>
        </div>

        <div class="modal__form-group">
          <input
            v-model.lazy="capacity"
            min="1"
            max="25"
            class="input input__100"
            placeholder="İşçi tutumu (nəfər)"
            type="number"
          />
          <span
            class="errorText"
            v-for="error in v$.capacity.$errors"
            :key="error.$uid"
          >
            İşçi tutumu boşdu
          </span>
        </div>

        <div class="modal__form-group">
          <input
            v-model.lazy="address"
            class="input input__100"
            min="1"
            max="9999"
            placeholder="Yerləşdiyi bina"
            type="number"
          />

          <span
            class="errorText"
            v-for="error in v$.address.$errors"
            :key="error.$uid"
          >
            Yerləşdiyi bina boşdu
          </span>
        </div>

        <div class="modal__form-group">
          <input
            min="1"
            max="25"
            v-model.lazy="floor"
            class="input input__100"
            placeholder="Yerləşdiyi mərtəbə"
            type="number"
          />
        </div>
        <span
          class="errorText"
          v-for="error in v$.floor.$errors"
          :key="error.$uid"
        >
          Yerləşdiyi mərtəbə boşdu
        </span>
        <div class="modal__form-group modal__flex">
          <button
           aria-label="İmtina"
            type="button"
            class="submitWhite"
            @click="$emit('close-modal')"
          >
            İmtina
          </button>

          <button  aria-label="Əlavə et" class="submit" type="submit">
            
              <div v-show="success" class="loading-dots">
  <h1 class="dot one">.</h1><h1 class="dot two">.</h1><h1 class="dot three">.</h1>
</div>
           <span v-show="!success">Əlavə et</span></button>
        </div>
        <div v-show="success" class="success">
          <p>Otaq uğurla yaradıldı</p>
        </div>
      </form>
    </div>
  </div>
</template>
 
<script>
import { useRoomStore } from "../../../../stores/room";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
export default {
  methods: {
    async addRoom() {
      const result = await this.v$.$validate();
      if (result) {
        await this.userStore.createRoom(
          this.name,
          this.capacity,
          this.address,
          this.floor
        );

        await this.userStore.fetchRoom();

        this.success = true;

        if ((this.success = true)) {
          setTimeout(() => {
            this.$emit("close-modal");
            this.success = false;
            this.name = "";
            this.capacity = "";
            this.address = "";
            this.floor = "";

            this.v$.$reset();
          }, 1500);
        }
      }
    },
  },

  data() {
    return {
      name: "",
      capacity: "",
      address: "",
      floor: "",
      success: false,
    };
  },

  validations() {
    return {
      name: { required },
      capacity: { required },
      address: { required },
      floor: { required },
    };
  },

  setup() {
    // onMounted(() => {
    //   userStore.fetchRoom();
    // });
    const userStore = useRoomStore();

    return { userStore, userStore, v$: useVuelidate() };
  },
};
</script>
