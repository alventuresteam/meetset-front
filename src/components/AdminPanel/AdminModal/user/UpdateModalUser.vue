<template>
  <div class="modal-overlay">
    <div class="modal modal__user" @click.stop>
      <div class="modal__head">
        <h6 class="modal__head-title">İstifadəçini redakte et</h6>
        <span class="modal__head-close" @click="close()"
          ><img src="../../../../assets/images/svg/modalClose.svg" alt=""
        /></span>
      </div>
      <form action="" class="modal__form" @submit.prevent="uppdateHandler">
        <div class="modal__form-group">
          <input
            class="input input__100"
            v-model.lazy="updateDataPerson.name"
            placeholder="Ad, soyad"
            maxlength="250"
            type="text"
          />

          <span
            v-for="error in v$.updateDataPerson.name.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </span>
        </div>

        <div class="modal__form-group">
          <input
            class="input input__100"
            v-model.lazy="updateDataPerson.fin_code"
            placeholder="FİN nömrə"
            maxlength="7"
            type="text"
          />

          <span
            v-for="error in v$.updateDataPerson.fin_code.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </span>
        </div>

        <div class="modal__form-group">
          <input
            class="input input__100"
            placeholder="Əməkdaşı olduğu şöbə"
            type="text"
            maxlength="250"
            v-model.lazy="updateDataPerson.position"
          />
          <span
            v-for="error in v$.updateDataPerson.position.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </span>
        </div>

        <div class="modal__form-group">
          <input
            class="input input__100"
            v-model.lazy="updateDataPerson.email"
            placeholder="E-mail"
            maxlength="250"
            type="text"
          />

          <span
            v-for="error in v$.updateDataPerson.email.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </span>
        </div>

        <div class="modal__form-group">
          <input
            v-if="passwordShow"
            class="input input__100"
            placeholder="Şifrə"
            maxlength="64"
            v-model.lazy="updateDataPerson.password"
            type="text"
          />

          <input
            v-else
            class="input input__100"
            placeholder="Şifrə"
            maxlength="64"
            v-model.lazy="updateDataPerson.password"
            type="password"
          />

          <div class="modal__form-img" @click="showPass()">
            <img
              v-if="passwordShow"
              class="formBox__img"
              src="../../../../assets/images/svg/passwordShowEye.svg"
              alt="meetSet Icon"
            />

            <img
              v-else
              class="formBox__img"
              src="../../../../assets/images/svg/passwordEye.svg"
              alt="meetSet Icon"
            />
          </div>

          <span
            v-for="error in v$.updateDataPerson.password.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </span>
        </div>

        <div class="modal__form-group modal__flex">
          <button  aria-label="İmtina" class="submitWhite" @click="close()">İmtina</button>
          <button
          aria-label="Yadda Saxla"
            class="submit"
            type="submit"
            placeholder="Görüşlə bağlı qeydlər"
          >
  <div v-show="success" class="loading-dots">
  <h1 class="dot one">.</h1><h1 class="dot two">.</h1><h1 class="dot three">.</h1>
</div>
           <span v-show="!success">Yadda saxla</span>            </button>
        </div>

        <div v-show="success" class="success">
          <p>Istifadəçi redakt edildi</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { usePersonStore } from "../../../../stores/user";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
export default {
  props: ["item"],

  data() {
    return {
      updateDataPerson: {},
      success: false,
    };
  },

  validations() {
    return {
      updateDataPerson: {
        name: { required },
        email: { email, required },
        password: { required },
        fin_code: { required },
        position: { required },
      },
    };
  },

  methods: {
    async uppdateHandler() {
      const result = await this.v$.$validate();
      if (result) {
        await this.userStore.updatePerson(this.updateDataPerson);
        await this.userStore.fetchPerson();

        this.success = true;

        if ((this.success = true)) {
          setTimeout(() => {
            this.$emit("close-modal");
            this.success = false;
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

  mounted() {
    Object.assign(this.updateDataPerson, this.item);
  },

  setup() {
    const userStore = usePersonStore();
    const passwordShow = ref(false);

    return { userStore, passwordShow, v$: useVuelidate() };
  },
};
</script>

