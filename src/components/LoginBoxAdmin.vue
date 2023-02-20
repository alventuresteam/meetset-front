<template>
  <div class="login__box">
    <img
      src="../assets/images/logo/logo.png"
      alt="meet-set logoin"
      class="login__box-img"
    />

    <form action="" class="login__box-form" @submit.prevent="login">
      <input
        type="text"
        class="input"
        placeholder="İstifadəçi adı vəya e-mail"
        v-model="email"
      />

      <span
        class="errorText"
        v-for="error in v$.email.$errors"
        :key="error.$uid"
      >
        Email Shevdi
      </span>
      <div class="formBox">
        <input
          v-if="passwordShow"
          v-model="password"
          type="password"
          class="input"
          placeholder="Şifrə "
        />

        <input
          v-else
          v-model="password"
          type="text"
          class="input"
          placeholder="Şifrə "
        />

        <div @click="showPass()">
          <img
            v-if="passwordShow"
            class="formBox__img"
            src="../assets/images/svg/passwordEye.svg"
            alt="meetSet Icon"
          />

          <img
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
        Password shevdi
      </span>
      <input
        type="submit"
        class="submit"
        value="Daxil ol "
      />

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
      passwordShow: true,
    };
  },

   validations() {
    return {
      email: { required, email },
      password: { required },
    };
  },
  methods: {
    async login() {
            const result = await this.v$.$validate();


      await this.userStore.signIn(this.email, this.password);
        if(this.userStore.user.role === 1){
      this.$router.push("/user");
        }else{
            alert('Sizin bura girmə icazəniz yoxdur')
        }


    },

    showPass() {
      this.passwordShow = !this.passwordShow;
    },
  },

  setup() {
   

    const userStore = useUserStore();

    return { userStore, v$: useVuelidate() };
  },
};
</script>