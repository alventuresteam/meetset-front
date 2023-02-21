<template>
  <div class="modal-overlay">
    <div class="modal modal__user" @click.stop>
      <div class="modal__head">
        <h6 class="modal__head-title">İstifadəçi yarat</h6>
        <span class="modal__head-close" @click="close()"
          ><img  loading="lazy"
            src="../../../../assets/images/svg/modalClose.svg"
            alt="modalClose"
        /></span>
      </div>
      <form class="modal__form" @submit.prevent="addPerson">
        <div class="modal__form-group">
          <input
            class="input input__100"
            v-model.lazy="name"
            maxlength="250"
            placeholder="Ad, soyad"
            type="text"
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
            class="input input__100"
            v-model.lazy="fin_code"
            placeholder="FİN nömrə"
            maxlength="7"
            type="text"
          />
          <span
            class="errorText"
            v-for="error in v$.fin_code.$errors"
            :key="error.$uid"
          >
            Fin boşdur
          </span>
        </div>

        <div class="modal__form-group">
          <input
            class="input input__100"
            placeholder="Əməkdaşı olduğu şöbə"
            type="text"
            maxlength="250"
            v-model.lazy="position"
          />

          <span
            class="errorText"
            v-for="error in v$.position.$errors"
            :key="error.$uid"
          >
            Vəzifə boşdu
          </span>
        </div>

        <div class="modal__form-group">
          <input
            class="input input__100"
            v-model.lazy="email"
            placeholder="E-mail"
            maxlength="250"
            type="text"
            autocomplete="off"
          />

          <span
            class="errorText"
            v-for="error in v$.email.$errors"
            :key="error.$uid"
          >
            Email boşdu
          </span>
        </div>

        <div class="modal__form-group">
          <input
            v-if="passwordShow"
            class="input input__100"
            placeholder="Şifrə"
            v-model.lazy="password"
            maxlength="64"
            type="text"
          />

          <input
            v-else
            class="input input__100"
            placeholder="Şifrə"
            maxlength="64"
            v-model.lazy="password"
            type="password"
          />

          <div class="modal__form-img" @click="showPass()">
            <img  loading="lazy"
              v-if="passwordShow"
              class="formBox__img"
              src="../../../../assets/images/svg/passwordShowEye.svg"
              alt="meetSet Icon"
            />

            <img  loading="lazy"
              v-else
              class="formBox__img"
              src="../../../../assets/images/svg/passwordEye.svg"
              alt="meetSet Icon"
            />
          </div>

          <span
            class="errorText"
            v-for="error in v$.password.$errors"
            :key="error.$uid"
          >
            Paroll boşdu
          </span>
        </div>
        <div class="modal__form-group modal__flex">
          <button class="submitWhite" @click="close">İmtina</button>

          <button
            class="submit"
            aria-label="Əlavə et"
            type="submit"
            placeholder="Görüşlə bağlı qeydlər"
          >
<div v-show="success" class="loading-dots">
  <h1 class="dot one">.</h1><h1 class="dot two">.</h1><h1 class="dot three">.</h1>
</div>
           <span v-show="!clickLoad">Əlavə et</span>          </button>
        </div>
        <div v-show="clickLoad" class="success">
          <p>Istifadəçi uğurla yarandıldı</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { usePersonStore } from "../../../../stores/user";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { ref } from "vue";
export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      fin_code: "",
      position: "",
      success: false,
      clickLoad:false,
    };
  },
  methods: {
    async addPerson(event) {
      const result = await this.v$.$validate();
      if (result) {
        await this.userStore.createPerson(
          this.name,
          this.fin_code,
          this.position,
          this.email,
          this.password
        );

        await this.userStore.fetchPerson();
        this.success = true;
        this.clickLoad = true

        if ((this.success = true)) {
          setTimeout(() => {
            this.$emit("close-modal");
            this.success = false;
this.clickLoad = false
            this.name = "";
            this.fin_code = "";
            this.position = "";
            this.email = "";
            this.password = "";

            this.v$.$reset();
          }, 1500);
        }
      }
    },
    showPass() {
      this.passwordShow = !this.passwordShow;
    },

    close() {
      this.$emit("close-modal");
    },
  },

  validations() {
    return {
      name: { required },
      email: { required },
      password: { required },
      fin_code: { required },
      position: { required },
    };
  },

  setup() {
    const userStore = usePersonStore();
    const passwordShow = ref(false);

    return { userStore, passwordShow, v$: useVuelidate() };
  },
};
</script>

