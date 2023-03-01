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
               maxlength="4"
               v-model="form.port"
               oninput="this.value = this.value.replace(/[a-zа-я]/gi, '')"
            />

            <div style="position: absolute; bottom: -32px">
               <span v-if="form.port && form.port.length < 4" class="errorText">Port 4 rəqəmdən çox ola bilməz </span>
            </div>
         </div>
      </div>

      <UploadFile
         @file="form.logo = $event"
      />
      <button
         aria-label="Yadda saxla"
         type="submit"
         class="setting__save"
         :disabled="ipInvalid || form.port.length < 4"
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

   <div v-show="clickLoad" class="loading-dots">
      <loading/>
   </div>
</template>

<script>
import {useSettingStore} from "../../stores/setting.js";
import UploadFile from "@/components/UploadFile.vue";
import Loading from "@/components/Loading.vue";

export default {
   components: { Loading, UploadFile },
   data() {
      return {
         form: {
            ip_address: '',
            port: '',
            logo: ''
         },
         clickLoad: false,
         ipInvalid: false
      };
   },
   setup() {
      const userStore = useSettingStore();
      return {userStore};
   },
   async mounted() {
      await this.userStore.fetchSetting();
      this.form.ip_address = await this.userStore.getSetting.ip_address;
      this.form.port = await this.userStore.getSetting.port;
   },
   methods: {
      isValidIpAddress(ipAddress) {
         const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
         return ipRegex.test(ipAddress);
      },

      onIpAddressInput(event) {
         if (!this.isValidIpAddress(this.form.ip_address)) {
            this.ipInvalid = true
         } else {
            this.ipInvalid = false
         }

         const numericRegex = /[0-9.]/g;
         event.target.value = event.target.value.match(numericRegex).join('');
      },
      async save() {
         let formData = new FormData();

         for (let key in this.form) {
            if (key !== 'logo') {
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
         await this.$toast.success('Yadda saxlanıldı');
      }
   }
};
</script>
