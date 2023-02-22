<template>
  <div class="modal-overlay">
    <div class="modal modal__room" @click.stop>
      <div class="modal__head">
        <h6 class="modal__head-title">Otağı redakte et</h6>
        <span class="modal__head-close" @click="close()">
          <img
            loading="lazy"
            src="../../../../assets/images/svg/modalClose.svg"
            alt=""
        /></span>
      </div>

      <form action="" class="modal__form" @submit.prevent="uppdateHandler">
        <div class="modal__form-group">
          <input
            v-model.lazy="updateDataRoom.name"
            class="input input__100"
            placeholder="Otağın adı"
            maxlength="30"
            type="text"
          />

          <span
            class="errorText"
            v-for="error in v$.updateDataRoom.name.$errors"
            :key="error.$uid"
          >
            Otağ boşdu
          </span>
        </div>

        <div class="modal__form-group">
          <input
            v-model.lazy="updateDataRoom.capacity"
            class="input input__100"
            min="1"
            max="25"
            placeholder="İşçi tutumu (nəfər)"
            type="number"
          />

          <span
            class="errorText"
            v-for="error in v$.updateDataRoom.capacity.$errors"
            :key="error.$uid"
          >
            İşçi tutumu boşdu
          </span>
        </div>

        <div class="modal__form-group">
          <input
            v-model.lazy="updateDataRoom.address"
            class="input input__100"
            max="9999"
            min="1"
            placeholder="Yerləşdiyi bina"
            type="number"
          />

          <span
            class="errorText"
            v-for="error in v$.updateDataRoom.address.$errors"
            :key="error.$uid"
          >
            Yerləşdiyi bina boşdu
          </span>
        </div>

        <div class="modal__form-group">
          <input
            v-model.lazy="updateDataRoom.floor"
            class="input input__100"
            min="1"
            max="25"
            placeholder="Yerləşdiyi mərtəbə"
            type="number"
          />
          <span
            class="errorText"
            v-for="error in v$.updateDataRoom.floor.$errors"
            :key="error.$uid"
          >
            Yerləşdiyi mərtəbə boşdu
          </span>
        </div>

        <div class="modal__form-group modal__flex">
          <button
            aria-label="İmtina"
            type="button"
            class="submitWhite"
            @click="close()"
          >
            İmtina
          </button>
          <!-- @click="handleUpdate(item)" -->

          <button
            class="submit"
            type="submit"
            aria-label="Yadda saxla"
            placeholder="Görüşlə bağlı qeydlər"
          >
            <span>Yadda saxla</span>
          </button>
        </div>
      </form>

      <div v-show="clickLoad" class="loading-dots">
        <img loading="lazy" src="../../../../assets/images/gif/load.gif" alt="gif" />
      </div>
    </div>
  </div>
</template>

<script>
import { useRoomStore } from "../../../../stores/room";
import { useVuelidate } from "@vuelidate/core";

import { required } from "@vuelidate/validators";

export default {
  setup() {
    const userStore = useRoomStore();
    return { userStore, v$: useVuelidate() };
  },
  props: ["item"],
  data() {
    return {
      updateDataRoom: {},
      clickLoad: false,
    };
  },

  validations() {
    return {
      updateDataRoom: {
        name: { required },
        capacity: { required },
        address: { required },
        floor: { required },
      },
    };
  },

  mounted() {
    Object.assign(this.updateDataRoom, this.item);
  },

  methods: {
    async uppdateHandler() {
      const result = await this.v$.$validate();
      if (result) {
        this.clickLoad = true;

        await this.userStore.updateRoom(this.updateDataRoom);
        await this.userStore.fetchRoom();

        this.$toast.success(`Otaqlar uğurla redakt olundu`);
        this.clickLoad = false;

        this.$emit("close-modal");
      }
    },

    close() {
      this.$emit("close-modal");
    },
  },
};
</script>
