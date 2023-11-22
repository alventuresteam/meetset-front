<template>
  <div class="admin">
    <Sidebar/>
    <div class="adminRightSide">
      <div v-if="$route.path === '/admin'">
        <Header title="İstifadəçilər"/>
      </div>

      <div v-if="$route.path === '/rooms'">
        <Header title="Otaqlar"/>
      </div>

      <div v-if="$route.path === '/calendars'">
        <Header title="Təqvim"/>
      </div>

      <div v-if="$route.path === '/logs'">
        <Header title="Tarixçə"/>
      </div>

      <div v-if="$route.path === '/settings'">
        <Header title="Tənzimləmələr"/>
      </div>

      <div v-if="$route.path === '/admin'">
        <Suspense>
          <template #default>
            <User @success="download"/>
          </template>

          <template #fallback>Load...</template>
        </Suspense>

        <div class="loading-dots" v-if="clickLoadUser">
          <loading/>
        </div>
      </div>

      <div v-if="$route.path === '/calendars'" style="height: 100%">
        <Suspense>
          <template #default>
            <Calendars @success="loadCalendar"/>
          </template>

          <template #fallback>Load...</template>
        </Suspense>
      </div>

      <div v-if="$route.path === '/logs'" style="height: 100%">
        <Suspense>
          <template #default>
            <Logs @success="loadLogs"/>
          </template>

          <template #fallback>Load...</template>
        </Suspense>
      </div>

      <div v-if="$route.path === '/rooms'">
        <Suspense>
          <template #default>
            <Rooms @success="downloadRoom"/>
          </template>

          <template #fallback>Load...</template>
        </Suspense>

        <div class="loading-dots" v-if="clickLoadRoom">
          <loading/>
        </div>
      </div>

      <div v-if="$route.path === '/settings'">
        <Suspense>
          <template #default>
            <Settings/>
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
import Calendars from "./Calendars.vue";
import Logs from "./Logs.vue";
import Settings from "./Settings.vue";

import {defineAsyncComponent} from "vue";
import Loading from "@/components/Loading.vue";

export default {
  components: {
    Calendars,
    Logs,
    Sidebar,
    User,
    Header,
    Rooms,
    Settings,
    Loading,
  },

  data() {
    return {
      clickLoadUser: true,
      clickLoadRoom: true,
      clickLoadCalendar: true,
      clickLoadLogs: true,
    }
  },

  methods: {
    download() {
      this.clickLoadUser = false
    },

    downloadRoom() {
      this.clickLoadRoom = false
    },

    loadCalendar() {
      this.clickLoadCalendar = false
    },

    loadLogs() {
      this.clickLoadLogs = false
    },
  },

  setup() {
    const Rooms = defineAsyncComponent({
      loader: () => import("./Rooms.vue"),
      delay: 1000,
      timeout: 3000,
      suspensible: true,
    });

    const Calendars = defineAsyncComponent({
      loader: () => import("./Calendars.vue"),
      delay: 1000,
      timeout: 3000,
      suspensible: true,
    });

    const Logs = defineAsyncComponent({
      loader: () => import("./Logs.vue"),
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

    return {Rooms,Logs, Calendars, User, Settings};
  },
};
</script>