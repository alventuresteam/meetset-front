 <template>
  <header class="container header">

    <img
      class="header__img"
      src="../../assets/images/logo/logo.png"
      alt="logo"
    />

    <div class="flex">
      <div @click="showModal = true" class="submit flex center__flex">
        Otaq rezerv et
        <img
          class="fix__img"
          src="../../assets/images/svg/pulus.svg"
          alt="pulus"
        />



      </div>
      <div class="">
        <div class="submitWhite flex center__flex" @click="closeDropDown">
          {{ userStore.getUser.name }}
          <img
            class="fix__img"
            src="../../assets/images/svg/dropdown.svg"
            alt="dropdown"
          />
        </div>

        <ul v-if='hideDropdown' class="dropDown">
            <li class="dropDown__item"  @click="logout()"><img src="../../assets/images/svg/exitBold.svg" alt="exit"> Çıxış</li>
        </ul>
      </div>
    </div>
  </header>

  <Suspense v-if="showModal">
    <template #default>
      <ReserveRoom v-show="showModal" @close-modal="showModal = false" />
    </template>

    <template #fallback>Load...</template>
  </Suspense>
</template>

<script>
import ReserveRoom from "../Modal/ReserveRoom.vue";
import { onMounted, defineAsyncComponent } from "vue";
import { useUserStore } from "../../stores/auth";
export default {
  components: { ReserveRoom },
  data() {
    return {
      showModal: false,
      hideDropdown:false,
    };
  },

  methods: {
   async logout() {
     await this.userStore.signOut();
      this.$router.push("/");
    },

    closeDropDown(){
        this.hideDropdown = !this.hideDropdown;
    }
  },

  setup() {
    onMounted(() => {
      //userStore.fetchUser();
    });

    const ReserveRoom = defineAsyncComponent({
      loader: () => import("../../components/Modal/ShowReservRoom.vue"),
      delay: 1000,
      timeout: 3000,
      suspensible: true,
    });

    const userStore = useUserStore();
    return { userStore, ReserveRoom };
  },
};
</script>