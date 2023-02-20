import { createRouter, createWebHistory } from "vue-router";

// import Home from "../views/Home.vue";
//import AdminLogin from "../views/AdminLogin.vue";
//import CalendarPage from "../views/Calendar.vue";
// import Admin from "../views/Admin.vue";
import { useUserStore } from "../stores/auth";
import axios from "axios";
const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"),
    beforeEnter: (to, from, next) => {
      LoggedInGuard(to, from, next, app);
    },
  },

  {
    path: "/admin",
    name: "Admin",
    component: () => import("@/views/AdminLogin.vue"),
    beforeEnter: (to, from, next) => {
      LoggedInGuardAdmin(to, from, next, app);
    },
  },

  {
    path: "/calendar",
    name: "CalendarPage",
    component: () => import("@/views/Calendar.vue"),
    beforeEnter: (to, from, next) => {
      guard(to, from, next, app);
    },
  },

  {
    children: [
      {
        path: "/user",
        name: "User",
        component: () => import("@/views/Admin.vue"),
        beforeEnter: (to, from, next) => {
          guardRoom(to, from, next, app);
        },
      },
      {
        path: "/rooms",
        name: "Rooms",
        component: () => import("@/views/Admin.vue"),
        beforeEnter: (to, from, next) => {
          guardRoom(to, from, next, app);
        },
      },
      {
        path: "/settings",
        name: "Settings",
        component: () => import("@/views/Admin.vue"),
        beforeEnter: (to, from, next) => {
          guardRoom(to, from, next, app);
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

const guard = async function (to, from, next, app) {
  if (useUserStore().user) {
    axios
      .get("https://meetset.al.ventures/api/auth/user", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        useUserStore().user = response.data.user;

        console.log(response);
        next();
      })
      .catch((error) => {
        window.location.href = "/";
        console.log(error);
      });
  } else next();
  // check for valid auth token
};

const guardRoom = async function (to, from, next, app) {
  // check for valid auth token
  if (useUserStore().user) {
    if (!useUserStore().user.id) await useUserStore().fetchUser();
    console.log(useUserStore().user);
    if (useUserStore().user.role === 1) next();
    else router.push("calendar");
  } else window.location.href = "/";
};

const LoggedInGuard = function (to, from, next, app) {
  if (useUserStore().user) {
    // check for valid auth token
    axios
      .get("https://meetset.al.ventures/api/auth/user", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        useUserStore().user = response.data.user;

        window.location.href = "/calendar";
      })
      .catch((error) => {
        next();
      });
  } else next();
};

const LoggedInGuardAdmin = function (to, from, next, app) {
  if (!useUserStore().user) {
    // check for valid auth token
    axios
      .get("https://meetset.al.ventures/api/auth/user", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        useUserStore().user = response.data.user;

        window.location.href = "/user";
      })
      .catch((error) => {
        next();
      });
  } else next();
};

export default router;
