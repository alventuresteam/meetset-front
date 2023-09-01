<template>
  <form action="" class="setting" @submit.prevent="save">
    <h1 class="setting__title">Server ayarları</h1>

    <div class="setting__flex">
      <div class="setting__group" style="position: relative">
        <label class="label">Server IP adresi</label>
        <input
          class="input"
          v-model="form.ip_address"
          type="text"
          maxlength="15"
          pattern="[0-9.]+"
          @input="onIpAddressInput"
        />

        <div style="position: absolute; bottom: -32px">
          <span v-if="ipInvalid" class="errorText">
            Düzgun IP adres yazın
          </span>
        </div>
      </div>

      <div class="setting__group" style="position: relative">
        <label class="label">Serverin port adresi</label>
        <input
          class="input"
          type="text"
          maxlength="5"
          v-model.trim="form.port"
          oninput="this.value = this.value.replace(/[a-zа-я]/gi, '')"
        />

        <div style="position: absolute; bottom: -32px">
          <span v-if="form.port && form.port.length > 5" class="errorText"
            >Port 6 rəqəmdən çox ola bilməz
          </span>
          <span v-if="form.port && form.port.length < 2" class="errorText"
            >Port 2 rəqəmdən az ola bilməz
          </span>
        </div>
      </div>
    </div>

    <UploadFile class="uploadfile" @file="form.logo = $event" />
    <h1 class="setting__title">Server ayarları</h1>
    <div class="participants">
      <div class="participants_tab">
        <div
          class="tabs_item"
          @click="showFirst = true"
          :style="showFirst === true ? 'border: 1px solid blue' : ''"
        >
          <input type="radio" v-model="showFirst" value="true" /> Exel-dən əlavə
          et
        </div>
        <br />
        <div
          class="tabs_item"
          @click="showFirst = false"
          :style="showFirst === false ? 'border: 1px solid blue' : ''"
        >
          <input type="radio" v-model="showFirst" value="false" />LDAP
          vasitəsilə əlavə et
        </div>
      </div>
      <div style="margin-top: 32px"  v-if="showFirst === true" class="uploadfile" >
        <UploadExcel @file="form.file = $event" />
      </div>
      <LDAP :form="form" v-else></LDAP>
    </div>
    <!-- :disabled="ipInvalid || form.port.length > 5 || form.port.length < 2" -->

    <button
      aria-label="Yadda saxla"
      type="submit"
      class="setting__save"
    >
      Yadda saxla

      <span>
        <img
          loading="lazy"
          src="../../assets/images/svg/check.svg"
          alt="check"
        />
      </span>
    </button>
  </form>

  <div v-if="clickLoad" class="loading-dots">
    <loading />
  </div>
</template>
<style lang="scss"></style>
<script>
import { useSettingStore } from "../../stores/setting.js";
import UploadFile from "@/components/UploadFile.vue";
import UploadExcel from "@/components/UploadExcel.vue";
import LDAP from "@/components/LDAP.vue";
import Loading from "@/components/Loading.vue";

export default {
  components: { Loading, UploadFile, UploadExcel, LDAP },
  data() {
    return {
      form: {
        ip_address: "",
        port: "",
        logo: "",
        file: "",
        ldap_host: "",
        ldap_username: "",
        ldap_password: "",
        ldap_port: "",
        ldap_base_dn: "",
        ldap_timeout: "",
      },
      clickLoad: false,
      ipInvalid: false,
      showFirst: true,
    };
  },
  setup() {
    const userStore = useSettingStore();
    return { userStore };
  },
  async mounted() {
    this.clickLoad = true;

    try {
      await this.userStore.fetchSetting();

      this.form.ip_address = await this.userStore.getSetting.ip_address;
      this.form.port = await this.userStore.getSetting.port;

      if (this.form.ip_address && this.form.port) {
        this.clickLoad = false;
      }
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    isValidIpAddress(ipAddress) {
      const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
      return ipRegex.test(ipAddress);
    },

    onIpAddressInput(event) {
      if (!this.isValidIpAddress(this.form.ip_address)) {
        this.ipInvalid = true;
      } else {
        this.ipInvalid = false;
      }

      const numericRegex = /[^0-9.]/g;
      event.target.value = event.target.value.replace(numericRegex, "");
    },
    async save() {
      let formData = new FormData();

      for (let key in this.form) {
        if (key !== "logo") {
          await formData.append(key, this.form[key]);
        } else {
          if (this.form[key]) {
            await formData.append(key, this.form[key]);
          }
        }
      }

      this.clickLoad = true;

      await this.userStore.updateSetting(formData);
      await this.userStore.fetchSetting();
      this.clickLoad = false;
      await this.$toast.success("Yadda saxlanıldı");
    },
  },
  mounted() {
    this.showFirst = true;
  },
};
</script>
