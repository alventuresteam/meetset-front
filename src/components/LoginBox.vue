<template>
  <div class="login__box">
    <img  loading="lazy"
      src="../assets/images/logo/logo.png"
      alt="meet-set logoin"
      class="login__box-img"
    />

    <form action="" class="login__box-form" @submit.prevent="login">
      <input
        type="text"
        class="input"
        placeholder="İstifadəçi adı vəya e-mail"
        v-model.lazy="email"
      />

      <span
        class="errorText"
        v-for="error in v$.email.$errors"
        :key="error.$uid"
      >
        Email boş ola bilməz
      </span>
      <div class="formBox">
        <input
          v-if="passwordShow"
          v-model.lazy="password"
          type="password"
          class="input"
          placeholder="Şifrə "
        />

        <input
          v-else
          v-model.lazy="password"
          type="text"
          class="input"
          placeholder="Şifrə "
        />

        <div @click="showPass()">
          <img  loading="lazy"
         
            v-if="passwordShow"
            class="formBox__img"
            src="../assets/images/svg/passwordEye.svg"
            alt="meetSet Icon"
          />

          <img  loading="lazy"
            v-else
            class="formBox__img"
            src="../assets/images/svg/passwordShowEye.svg"
            alt="meetSet Icon"
          />
        </div>
      </div>

      <span
        class="errorText"
        v-for="error in v$.password.$errors"
        :key="error.$uid"
      >
        Şifrə boş ola bilməz
      </span>

      <span class="errorText" v-if="userStore.error"
        >Email və ya şifrə yanlışdır</span
      >

      <input type="submit" class="submit" value="Daxil ol " />
    </form>
  </div>
</template>


<script>
// import { onMounted } from "vue";
import { useUserStore } from "../stores/auth";
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
export default {
  data() {
    return {
      email: "",
      password: "",
      passwordShow: true,
    };
  },
  methods: {
    async login() {
      const result = await this.v$.$validate();
      if (result) {
        await this.userStore.signIn(this.email, this.password);

// setTimeout(() => {
//     this.userStore.error = ''
// }, 1500);


        if (!this.userStore.error) {
          this.$router.push("/calendar");
        }
      }
    },

    showPass() {
      this.passwordShow = !this.passwordShow;
    },
  },

  validations() {
    return {
      email: { required, email },
      password: { required },
    };
  },
  setup() {
  

    const userStore = useUserStore();

    return { userStore, v$: useVuelidate() };
  },
};
</script>


