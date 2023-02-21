<template>
  <form action="" class="setting" @submit.prevent="save">
    <h1 class="setting__title">Server ayarları</h1>

    <div class="setting__flex">
      <div class="setting__group">
        <label class="label" for="">Server IP adresi</label>
        <input
          class="input"
          v-model.lazy="userStore.getSetting.ip_address"
          type="text"
        />
      </div>

      <div class="setting__group">
        <label class="label" for="">Serverin port adresi</label>
        <input
          class="input"
          v-model.lazy="userStore.getSetting.port"
          type="number"
          min="0"
        />
      </div>
    </div>

                  

    <button aria-label="Yadda saxla" type="submit" class="setting__save">
      Yadda saxla
      
      <span><img  loading="lazy" src="../../assets/images/svg/check.svg" alt="check" /></span>
    </button>
  </form>
</template>

<script>
import { onMounted } from "vue-demi";
import { useSettingStore } from "../../stores/setting.js";
export default {
  data() {
    return {
   
    };
  },
  setup() {
    onMounted(() => {
      userStore.fetchSetting();
    });
    const userStore = useSettingStore();

    return { userStore };

       
  },

  methods: {
    async save() {
      await this.userStore.updateSetting(this.userStore.getSetting);
      await this.userStore.fetchSetting();
    },
  },
};
</script>
