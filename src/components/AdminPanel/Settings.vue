<template>

  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane key="1" tab="Server ayarları">
      <form action="" class="setting" id="server" @submit.prevent="saveServer">
        <h1 class="setting__title">Server ayarları <span class="text-danger">*</span></h1>
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
              <span v-if="form.port && form.port.length > 5" class="errorText">
                Port 6 rəqəmdən çox ola bilməz
              </span>
              <span v-if="form.port && form.port.length < 2" class="errorText">
                Port 2 rəqəmdən az ola bilməz
              </span>
            </div>
          </div>
        </div>

        <h1 class="setting__title">Şifrə təyin et <span class="text-danger">*</span></h1>
        <a-alert message="KIOSK mode-dan cixmaq üçün şifrə təyin et" type="warning" show-icon/>

        <div class="setting__flex">
          <div class="setting__group" style="position: relative; padding-top: 20px">
            <input class="input" v-model="form.kiosk_password" type="text"
                   placeholder="KIOSK moddan çıxmaq üçün şifrə"/>
          </div>
        </div>

        <h1 class="setting__title">Dəvət ediləcəklər (CC)</h1>
        <a-alert message="Bu  seçimlə siz dəvət olunanlar hissəsini  çıxarmış və ya əlavə etmiş olacaqsınız"
                 type="warning" show-icon/>
        <div class="setting__flex" style="padding: 20px 0">
          <label for="checkedInvited" style="margin-right: 10px">Deaktiv et</label>
          <a-switch id="checkedInvited" v-model:checked="form.checked_invited"/>
          <label for="checkedInvited" style="margin-left: 10px">Aktiv et</label>
        </div>

        <div style="display: flex; gap: 16px">
          <button aria-label="Yadda saxla" type="submit" class="setting__save">
            Yadda saxla
            <span>
              <img loading="lazy" src="../../assets/images/svg/check.svg" alt="check"/>
            </span>
          </button>
        </div>
      </form>
    </a-tab-pane>
    <a-tab-pane key="2" tab="Giriş səhifəsi ayarları" force-render>
      <form action="" class="setting" id="login-page" @submit.prevent="saveLoginPage">
        <h1 class="setting__title">Giriş səhifəsi ayarları</h1>

        <label class="label" for="logo">Rəngli loqonu yükəyin</label>
        <UploadFile class="uploadfile" id="logo" @file="form.logo = $event"/>

        <label class="label" for="logo_dark">Monoxrom loqonu yükləyin</label>
        <UploadFile class="uploadfile" id="logo_dark" @file="form.logo_dark = $event"/>

        <div class="setting__flex" style="margin-top: 20px">
          <div class="setting__group" style="position: relative; width: 100%;">
            <label class="label">Giriş səhifəsi üçün fon mətnini əlavə edin</label>
            <textarea
                class="input"
                rows="20"
                style="width: 100%;"
                v-model="form.login_text"
                type="text"
            ></textarea>
            <div style="position: absolute; bottom: -32px">
              <span v-if="ipInvalid" class="errorText">
                Düzgun mətn yazın
              </span>
            </div>
          </div>
        </div>
        <div style="display: flex; gap: 16px">
          <button aria-label="Yadda saxla" type="submit" class="setting__save">
            Yadda saxla
            <span>
                <img loading="lazy" src="../../assets/images/svg/check.svg" alt="check"/>
            </span>
          </button>
        </div>
      </form>
    </a-tab-pane>
    <a-tab-pane key="3" tab="Əməkdaşlar">
      <form action="" class="setting" id="employer" @submit.prevent="saveEmployer">
        <h1 class="setting__title">İştirakçılar</h1>
        <div class="participants">
          <div class="participants_tab">
            <div class="tabs_item" @click="showFirst = true"
                 :style="showFirst === true ? 'border: 1px solid blue' : ''">
              <input type="radio" v-model="showFirst" value="true"/>
              Excel-dən əlavə et
            </div>
            <br/>
            <div class="tabs_item" @click="showFirst = false"
                 :style="showFirst === false ? 'border: 1px solid blue' : ''">
              <input type="radio" v-model="showFirst" value="false"/>
              LDAP vasitəsilə əlavə et
            </div>
          </div>
          <div style="margin-top: 32px" v-if="showFirst === true" class="uploadfile">
            <UploadExcel @file="form.file = $event"/>
          </div>
          <LDAP :data="userStore" :form="form" v-else></LDAP>
        </div>
        <div style="display: flex; gap: 16px">
          <button aria-label="Yadda saxla" type="submit" class="setting__save">
            Yadda saxla
            <span>
            <img
                loading="lazy" src="../../assets/images/svg/check.svg" alt="check"/>
            </span>
          </button>
          <button v-if="showFirst === false" type="" aria-label="LDAP Import" @click="ldapimport" class="setting__save">
            LDAP Import
          </button>
        </div>
      </form>
    </a-tab-pane>
  </a-tabs>

  <!--  <div v-if="clickLoad" class="loading-dots">-->
  <!--    <loading />-->
  <!--  </div>-->
</template>
<style lang="scss"></style>
<script>
import {useSettingStore} from "@/stores/setting";
import UploadFile from "@/components/UploadFile.vue";
import UploadExcel from "@/components/UploadExcel.vue";
import LDAP from "@/components/LDAP.vue";
import Loading from "@/components/Loading.vue";

import {defineComponent, ref} from 'vue';
import {SmileOutlined} from '@ant-design/icons-vue';

export default defineComponent({
  components: {Loading, UploadFile, UploadExcel, LDAP, SmileOutlined},
  data() {
    return {
      form: {
        ip_address: "",
        port: "",
        logo: "",
        logo_dark: "",
        file: "",
        ldap_host: "",
        ldap_username: "",
        ldap_password: "",
        ldap_port: "",
        ldap_base_dn: "",
        ldap_timeout: "",
        login_text: "",
        kiosk_password: "",
        checked_invited: false,
        type: this.showFirst ? 'excel' : 'ldap',
      },
      clickLoad: false,
      ipInvalid: false,
      showFirst: true,
    };
  },
  setup() {
    const userStore = useSettingStore();
    return {activeKey: ref('1'), userStore};
  },
  async mounted() {

    this.showFirst = true;

    this.clickLoad = true;

    try {
      await this.userStore.fetchSetting();

      this.form.ip_address = await this.userStore.getSetting.ip_address;
      this.form.port = await this.userStore.getSetting.port;
      this.form.kiosk_password = await this.userStore.getSetting.kiosk_password;
      this.form.login_text = await this.userStore.getSetting.login_text;
      this.form.checked_invited = await this.userStore.getSetting.checked_invited === 1;

      this.form.ldap_host = await this.userStore.getSetting.ldap_host;
      this.form.ldap_base_dn = await this.userStore.getSetting.ldap_base_dn;
      this.form.ldap_port = await this.userStore.getSetting.ldap_port;
      this.form.ldap_password = await this.userStore.getSetting.ldap_password;
      this.form.ldap_timeout = await this.userStore.getSetting.ldap_timeout;
      this.form.ldap_username = await this.userStore.getSetting.ldap_username;
      this.showFirst = await this.userStore.getSetting.type === 'excel';

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
    async saveServer() {
      let formData = new FormData();

      for (let key in this.form) {
        if (key === 'checked_invited') {
          await formData.append(key, this.form[key] ? 1 : 0);
        } else {
          await formData.append(key, this.form[key]);
        }
      }

      this.clickLoad = true;

      await this.userStore.updateServerSetting(formData);

      await this.userStore.fetchSetting();
      this.clickLoad = false;
      await this.$toast.success("Yadda saxlanıldı");
    },
    async saveLoginPage() {
      let formData = new FormData();

      formData.append("login_text", this.form.login_text);

      if (this.form.logo) {
        formData.append("logo", this.form.logo);
      }
      if (this.form.logo_dark) {
        formData.append("logo_dark", this.form.logo_dark);
      }

      this.clickLoad = true;

      await this.userStore.updateLoginPageSetting(formData);

      await this.userStore.fetchSetting();
      this.clickLoad = false;
      await this.$toast.success("Yadda saxlanıldı");
    },
    async saveEmployer() {
      let formData = new FormData();

      for (let key in this.form) {

        if (key === 'type') {
          await formData.append(key, this.showFirst ? 'excel' : 'ldap');
        } else {
          await formData.append(key, this.form[key]);
        }
      }

      this.clickLoad = true;

      await this.userStore.updateEmployer(formData);

      await this.userStore.fetchSetting();
      this.clickLoad = false;
      await this.$toast.success("Yadda saxlanıldı");
    },
    async ldapimport() {
      await this.userStore.postLdap();
    }
  },
});
</script>

