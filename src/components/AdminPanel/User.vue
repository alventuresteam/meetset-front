<template>
  <div class="user">
    <div class="user__item" v-for="item in userStore?.getPerson" :key="item.id">
      <div class="user__info">
        <img  loading="lazy"
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
          <div class="user__info-remove" @click="showDeletButtons = true">
            Sil
          </div>
          <div v-show="success" class="success">
            <p>Istifadəçi uğurla silindi</p>
          </div>
          <Suspense v-if="showDeletButtons">
            <template #default>
              <div class="modal-overlay" style="background: rgb(0 0 0 / 41%)">
                <div class="modal modal__remove" @click.stop>
                  <div class="modal__head" v-show="showDeletButtons">
                    <h6 class="modal__head-title">Otaq rezervasiyasını sil</h6>
                  </div>

                  <div>
                    <p class="modal__form-delete">
                      Bu otaq rezervasiyasını silmək istədiyinizə əminsiniz?
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
                      @click="handleDelete(item)"
                      type="submit"
                      class="submitWhite"
                      id="messg"
                    >
                       <div v-show="success" class="loading-dots">
  <h1 class="dot one">.</h1><h1 class="dot two">.</h1><h1 class="dot three">.</h1>
</div>
           <span v-show="!success">Sil</span> 
                      <img  loading="lazy"
                        src="../../assets/images/svg/delet.svg"
                        alt="delet"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </template>

            <template #fallback>Load...</template>
          </Suspense>
        </div>
      </div>
    </div>

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
    };
  },

  methods: {
    handleUpdate(item) {
      this.showUpdateModalUser = true;
      this.updateDataPerson = item;
    },

    async handleDelete(item) {
      await this.userStore.deletePerson(item);
      await this.userStore.fetchPerson();
      this.success = true;
      if ((this.success = true)) {
        setTimeout(() => {
          this.showDeletButtons = false;
          this.success = false;
        }, 1500);
      }
      console.log(item);
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