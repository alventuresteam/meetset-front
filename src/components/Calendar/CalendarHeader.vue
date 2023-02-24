<template>
    <header class="header">
        <div class="container">
            <img
                loading="lazy"
                class="header__img"
                src="../../assets/images/logo/logo.png"
                alt="logo"
            />

            <div class="flex">
                <div @click="openModal" class="submit flex center__flex">
                    <span>Otaq rezerv et</span>
                    <img
                        loading="lazy"
                        width="17"
                        height="17"
                        class="fix__img"
                        src="../../assets/images/svg/pulus.svg"
                        alt="pulus"
                    />
                </div>

                <div class="p-relative">
                    <div
                        id="dropDownBox"
                        class="submitWhite flex center__flex"
                        @click.stop="hideDropdown = true"
                    >
                        {{ userStore.getUser.name }}
                        <!--                        <span>{{ user.name }}</span>-->

                        <img
                            loading="lazy"
                            class="fix__img"
                            src="../../assets/images/svg/dropdown.svg"
                            alt="dropdown"
                        />
                    </div>

                    <ul id="dropDown" v-if="hideDropdown" class="dropDown">
                        <li class="dropDown__item" @click="logout()">
                            <img
                                loading="lazy"
                                src="../../assets/images/svg/exitBold.svg"
                                alt="exit"
                            />
                            Çıxış
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </header>


    <div v-if="clickLoad" class="loading-dots">
        <img
            class="animationLoad"
            loading="lazy"
            src="../../assets/images/gif/load.svg"
            alt="gif"
        /></div>

    <Suspense v-if="showModal">
        <template #default>
            <Transition name="slide-fade" appear>

                <ReserveRoom v-show="showModal" @close-modal="CloseModal"/>

            </Transition>

        </template>

        <template #fallback>Load...</template>
    </Suspense>
</template>

<script>
import ReserveRoom from "../Modal/ReserveRoom.vue";
import {onMounted, defineAsyncComponent} from "vue";
import {useUserStore} from "../../stores/auth";

export default {
    components: {ReserveRoom},
    data() {
        return {
            showModal: false,
            hideDropdown: false,
            user: '',
            clickLoad: false,
        };
    },

    methods: {
        async logout() {

            this.clickLoad = true

            await this.userStore.signOut();

            if (this.userStore.token) {
                this.clickLoad = false

                this.$router.push("/");

            }
        },


        openModal(){
            this.showModal = true
            document.querySelector("body").style.overflowY = 'hidden'
        },


        CloseModal(){
            this.showModal = false
            document.querySelector("body").style.overflowY = 'auto'
        },
        closeDropDown() {
            this.hideDropdown = false;
        },
    },

    mounted() {
        document.querySelector("body").addEventListener("click", this.closeDropDown);
        this.user = JSON.parse(localStorage.getItem('user'));


    },
    beforeDestroy() {
        document
            .querySelector("body")
            .removeEventListener("click", this.closeDropDown);
    },

    setup() {
        const ReserveRoom = defineAsyncComponent({
            loader: () => import("../../components/Modal/ShowReservRoom.vue"),
            delay: 1000,
            timeout: 3000,
            suspensible: true,
        });

        onMounted(() => {
            userStore.fetchUser();
        });

        const userStore = useUserStore();
        return {userStore, ReserveRoom};
    },
};
</script>


