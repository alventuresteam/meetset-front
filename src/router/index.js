import {createRouter, createWebHistory} from "vue-router";

const routes = [
   {
      path: "/",
      name: "Home",
      component: () => import("@/views/Home.vue"),
      beforeEnter: () => {
         if (localStorage.getItem('user')) {
            if (JSON.parse(localStorage.getItem('user')).role === 0) {
               window.location.href = "/calendar";
            } else {
               window.location.href = "/user";
            }
         }
      }
   },

   {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("@/views/NotFound.vue"),
   },


   {
      path: "/calendar",
      name: "CalendarPage",
      component: () => import("@/views/Calendar.vue"),
      beforeEnter: () => {
         if (localStorage.getItem('user')) {
            if (JSON.parse(localStorage.getItem('user')).role === 1) {
               window.location.href = "/user";
            }
         }
      }
   },

   {
      children: [
         {
            path: "/user",
            name: "User",
            component: () => import("@/views/Admin.vue"),
            beforeEnter: () => {
               if (localStorage.getItem('user')) {
                  if (JSON.parse(localStorage.getItem('user')).role === 0) {
                     window.location.href = "/calendar";
                  }
               }
            }
         },
         {
            path: "/rooms",
            name: "Rooms",
            component: () => import("@/views/Admin.vue"),
            beforeEnter: () => {
               if (localStorage.getItem('user')) {
                  if (JSON.parse(localStorage.getItem('user')).role === 0) {
                     window.location.href = "/calendar";
                  }
               }
            }
         },
         {
            path: "/settings",
            name: "Settings",
            component: () => import("@/views/Admin.vue"),
            beforeEnter: () => {
               if (localStorage.getItem('user')) {
                  if (JSON.parse(localStorage.getItem('user')).role === 0) {
                     window.location.href = "/calendar";
                  }
               }
            }
         },
      ],
   },
];

const router = createRouter({
   history: createWebHistory(import.meta.env.BASE_URL),
   routes,
});

export default router;