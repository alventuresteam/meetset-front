<template>
  <div class="ldap">
    <div class="ldap_group">
      <div class="setting__group" style="position: relative">
        <label class="label">LDAP host</label>
        <input
          class="input"
          v-model="form.ldap_host"
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
        <label class="label">LDAP username</label>
        <input
          class="input"
          type="text"
          maxlength="15"
          v-model="form.ldap_username"
        />
      </div>
    </div>
    <div class="ldap_group">
      <div class="setting__group" style="position: relative">
        <label class="label">LDAP port</label>
        <input
          class="input"
          v-model="form.ldap_port"
          type="phone"
          maxlength="5"
          pattern="[0-9.]+"
          @input="onIpAddressInput"
        />
        <div style="position: absolute; bottom: -32px">
          <span v-if="form.ldap_port && form.ldap_port.length < 2" class="errorText">
            Port 2 rəqəmdən az ola bilməz
          </span>
        </div>
      </div>

      <div class="setting__group" style="position: relative">
        <label class="label">LDAP password</label>
        <input
          class="input"
          type="text"
          maxlength="16"
          v-model="form.ldap_password"
        />
      </div>
    </div>
    <div class="ldap_group">
      <div class="setting__group" style="position: relative">
        <label class="label">LDAP base DN</label>
        <input
          class="input"
          type="text"
          maxlength="40"
          v-model="form.ldap_base_dn"
        />
      </div>
      <div class="setting__group" style="position: relative">
        <label class="label">LDAP timeout</label>
        <input
          class="input"
          v-model="form.ldap_timeout"
          type="text"
          maxlength="15"
          pattern="[0-9.]+"
          @input="onIpAddressInput"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.ldap {
  .ldap_group {
    display: flex;
    margin-top: 32px;
  }
}
</style>

<script>
import UploadExcel from "@/components/UploadExcel.vue";
import Loading from "@/components/Loading.vue";

export default {
  components: { Loading, UploadExcel },
  data() {
    return {
      clickLoad: false,
      ipInvalid: false,
      showFirst: true,
      ipInvalid: false,

    };
  },
  methods:{
    isValidIpAddress(ipAddress) {
      const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
      return ipRegex.test(ipAddress);
    },
    onIpAddressInput(event) {
      if (!this.isValidIpAddress(this.form.ldap_host)) {
        this.ipInvalid = true;
      } else {
        this.ipInvalid = false;
      }

      const numericRegex = /[^0-9.]/g;
      event.target.value = event.target.value.replace(numericRegex, "");
    },
  },
  props: {
    form: {
      type: Object,
    },
  },
};
</script>
