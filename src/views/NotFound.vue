<template>
  <header class="container header">

<a href="/">
    <img  loading="lazy"
      class="header__img"
      src="../assets/images/logo/logo.png"
      alt="logo"
    />
</a>
    <div class="flex" >
  
      <div >
        <div class="submitWhite flex center__flex" @click="closeDropDown">
          {{ userStore.getUser.name }}
          <img  loading="lazy"
            class="fix__img"
            src="../assets/images/svg/dropdown.svg"
            alt="dropdown"
          />
        </div>

        <ul v-if='hideDropdown' class="dropDown">
            <li class="dropDown__item"  @click="logout()"><img  loading="lazy" src="../assets/images/svg/exitBold.svg" alt="exit"> Çıxış</li>
        </ul>
      </div>
    </div>

  </header>

 

<div style="background:#F8FAFC">
<img class="notFound" src="../assets/images/notFound.jpg" alt="notFound" />
    
</div>


</template>


<script>
import ReserveRoom from "../components/Modal/ReserveRoom.vue";
import { onMounted, defineAsyncComponent } from "vue";
import { useUserStore } from "@/stores/auth";
export default {
  components: { ReserveRoom },
  data() {
    return {
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
      userStore.fetchUser();
    });

   

    const userStore = useUserStore();
    return { userStore };
  },
};
</script>