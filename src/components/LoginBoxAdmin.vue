<template>
    <div class="login__box">
        <img
            loading="lazy"
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
                    <img
                        loading="lazy"
                        v-if="passwordShow"
                        class="formBox__img"
                        src="../assets/images/svg/passwordEye.svg"
                        alt="meetSet Icon"
                    />

                    <img
                        loading="lazy"
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
        {{
                    error.$message === "Value is required"
                        ? "Şifrə boş ola bilməz"
                        : "Şifrə min 6 simvol olmalıdır"
                }}
      </span>

            <span class="errorText" v-if="userStore.error"
            >Email və ya şifrə yanlışdır</span
            >

            <button class="submit" type="submit">Daxil ol</button>
        </form>
    </div>
</template>

<script>
// import { onMounted } from "vue";
import {useUserStore} from "../stores/auth";
import {useVuelidate} from "@vuelidate/core";
import {required, email, minLength} from "@vuelidate/validators";

export default {
    data() {
        return {
            passwordShow: true,
        };
    },

    validations() {
        return {
            email: {required, email},
            password: {required, minLength: minLength(6)},
        };
    },
    methods: {
        async login() {
            const result = await this.v$.$validate();

            if (result) {
                await this.userStore.signIn(this.email, this.password);

                if (this.userStore.user.role === 1) {
                    if (!this.userStore.error) {

                        this.$router.push("/user");
                    }
                } else {
                    alert("Sizin bura girmə icazəniz yoxdur");
                }
            }

        },

        showPass() {
            this.passwordShow = !this.passwordShow;
        },
    },

    setup() {
        const userStore = useUserStore();

        return {userStore, v$: useVuelidate()};
    },
};
</script>
