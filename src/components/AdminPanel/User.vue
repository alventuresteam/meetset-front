<template>
  <div class="user">
    <div class="user__item" v-for="item in userStore?.getPerson" :key="item.id">
      <div class="user__info">
        <img
          loading="lazy"
          src="../../assets/images/svg/user.svg"
          class="user__info-img"
          alt="user"
        />
        <div class="user__info-box">
          <h2 class="user__info-title name">{{ item.name }}</h2>
          <span class="user__info-subtitle">{{ item.position }}</span>
        </div>
      </div>

      <div class="user__info">
        <div class="user__info-box email">
          <span class="user__info-subtitle email">E-mail</span>
          <h2 class="user__info-title emailName">{{ item.email }}</h2>
        </div>

        <div class="user__info">
          <div class="user__info-edit" @click="handleUpdate(item)">
            Redakt et
          </div>
          <div class="user__info-remove" @click="showDeletButtons = true; id= item.id">
            Sil
          </div>
          <div v-show="success" class="success">
            <p>Istifadəçi uğurla silindi</p>
          </div>
        </div>
      </div>
    </div>

    <Suspense v-if="showDeletButtons">
      <template #default>
        <div class="modal-overlay" style="background: rgb(0 0 0 / 41%)">
          <div class="modal modal__remove" @click.stop>
            <div class="modal__head" v-show="showDeletButtons">
              <h6 class="modal__head-title">İstifadəçini sil</h6>
              <pre>{{ item }}</pre>
            </div>

            <div>
              <p class="modal__form-delete">
                Bu istifadəçini silmək istədiyinizə əminsiniz?
              </p>
            </div>

            <div class="modal__form-group modal__flex">
              <button
                aria-label="Imtina et"
                type="button"
                class="submitWhite"
                @click="showDeletButtons = false"
              >
                Imtina et
              </button>

              <button
                aria-label="Sil"
                @click="handleDelete(id)"
                type="submit"
                class="submitWhite"
                id="messg"
              >
                <div v-show="clickLoad" class="loading-dots">
                  <h1 class="dot one">.</h1>
                  <h1 class="dot two">.</h1>
                  <h1 class="dot three">.</h1>
                </div>

                <span v-show="!clickLoad">Sil</span>

                <img
                  loading="lazy"
                  src="../../assets/images/svg/delet.svg"
                  alt="delet"
                  v-show="!clickLoad"
                />
              </button>
            </div>
          </div>
        </div>
      </template>

      <template #fallback>Load...</template>
    </Suspense>

    <Suspense v-if="showUpdateModalUser">
      <template #default>
        <UpdateModalUser
          :item="updateDataPerson"
          v-show="showUpdateModalUser"
          @close-modal="showUpdateModalUser = false"
        />
      </template>

      <template #fallback>Load...</template>
    </Suspense>
  </div>
</template>

<script>
import { ref, defineAsyncComponent, onMounted } from "vue";
import { usePersonStore } from "../../stores/user";

import UpdateModalUser from "./AdminModal/user/UpdateModalUser.vue";
export default {
  components: {
    UpdateModalUser,
  },
  data() {
    return {
      updateDataPerson: {},
      showDeletButtons: false,
      success: false,
      clickLoad: false,
      id: ''
    };
  },

  methods: {
    handleUpdate(item) {
      this.showUpdateModalUser = true;
      this.updateDataPerson = item;
    },

    async handleDelete(id) {
        await this.userStore.deletePerson(id);
        await this.userStore.fetchPerson();
        this.success = true;
        this.clickLoad = true;
        if ((this.success = true)) {
          setTimeout(() => {
            this.showDeletButtons = false;
            this.success = false;
            this.clickLoad = false;
          }, 1500);
        }
    },
  },

  setup() {
    const UpdateModalUser = defineAsyncComponent({
      loader: () =>
        import(
          "../../components/AdminPanel/AdminModal/user/UpdateModalUser.vue"
        ),
      delay: 1000,
      timeout: 3000,
      suspensible: true,
    });

    onMounted(() => {
      userStore.fetchPerson();
    });

    const showUpdateModalUser = ref(false);

    const userStore = usePersonStore();

    return { userStore, showUpdateModalUser, UpdateModalUser };
  },
};
</script>
