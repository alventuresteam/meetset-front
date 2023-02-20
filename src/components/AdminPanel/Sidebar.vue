<template>
  <aside class="sidebar">
    <img
      src="../../assets/images/logo/whiteLogo.png"
      alt="sidebar logo"
      class="sidebar__logo"
    />

    <div v-for="item in nav" :key="item.id">
      <router-link
        :class="['sidebar__item', { active: item.route === $route.path }]"
        :to="item.route"
      >
        <img
          class="sidebar__item-img"
          :src="getImageUrl(item.img)"
          :alt="item.name"
        />
        {{ item.name }}
      </router-link>
    </div>
    <span @click="logout()" class="sidebar__item">
      <img
        class="sidebar__item-img"
        src="../../assets/images/svg/exit.svg"
        alt="exit"
      />
      Çıxış
    </span>
    <router-view />
  </aside>
</template>

<script>
import { useUserStore } from "../../stores/auth";
export default {
  setup() {
    const userStore = useUserStore();
    const getImageUrl = (name) => {
      return new URL(`../../assets/images/svg/${name}`, import.meta.url).href;
    };
    return { getImageUrl, userStore };
  },

  computed() {
    return this.nav.find((item) => item.id === selected.value);
  },

  data() {
    return {
      selected: 1,

      nav: [
        {
          id: "1",
          name: "İstifadəçilər",
          route: "/user",
          img: "profile.svg",
        },
        {
          id: "2",

          name: "Otaqlar",
          route: "/rooms",
          img: "rooms.svg",
        },
        {
          name: "Tənzimləmələr",
          route: "/settings",
          img: "settings.svg",
        },
      ],
    };
  },

  methods: {
    async logout() {
      await this.userStore.signOut();
      this.$router.push("/admin");
    },
  },
};
</script>