<template>
  <div class="admin">
    <Sidebar />
    <div class="adminRightSide">
      <div v-if="$route.path === '/user'">
        <Header title="Istifadəçilər" />
      </div>

      <div v-if="$route.path === '/rooms'">
        <Header title="Otaqlar" />
      </div>

      <div v-if="$route.path === '/settings'">
        <Header title="Tənzimləmələr" />
      </div>

      <div v-if="$route.path === '/user'">
        <Suspense>
          <template #default>
            <User />
          </template>

          <template #fallback>Load...</template>
        </Suspense>

      </div>
      <div v-if="$route.path === '/rooms'">
        <Suspense>
          <template #default>
            <Rooms />
          </template>

          <template #fallback>Load...</template>
        </Suspense>
      </div>

      <div v-if="$route.path === '/settings'">
        <Suspense>
          <template #default>
            <Settings />
          </template>

          <template #fallback>Load...</template>
        </Suspense>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "./Sidebar.vue";
import User from "./User.vue";
import Header from "./Header.vue";
import Rooms from "./Rooms.vue";
import Settings from "./Settings.vue";

import { defineAsyncComponent } from "vue";

export default {
  components: {
    Sidebar,
    User,
    Header,
    Rooms,
    Settings,
  },

  setup() {
    const Rooms = defineAsyncComponent({
      loader: () => import("./Rooms.vue"),
      delay: 1000,
      timeout: 3000,
      suspensible: true,
    });

    const User = defineAsyncComponent({
      loader: () => import("./User.vue"),
      delay: 1000,
      timeout: 3000,
      suspensible: true,
    });

    const Settings = defineAsyncComponent({
      loader: () => import("./Settings.vue"),
      delay: 1000,
      timeout: 3000,
      suspensible: true,
    });

    return {  Rooms, User, Settings };
  },
};
</script>