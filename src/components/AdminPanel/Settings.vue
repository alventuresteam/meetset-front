<template>
    <form action="" class="setting" @submit.prevent="save">
        <h1 class="setting__title">Server ayarları</h1>

        <div class="setting__flex">
            <div class="setting__group">
                <label class="label">Server IP adresi</label>
                <input
                    class="input"
                    v-model="form.ip_address"
                    type="text"
                />
            </div>

            <div class="setting__group">
                <label class="label">Serverin port adresi</label>
                <input
                    class="input"
                    v-model="form.port"
                    type="number"
                    min="0"
                />
            </div>
        </div>

        <UploadFile
            @file="form.logo = $event"
        />

        <button aria-label="Yadda saxla" type="submit" class="setting__save">
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
    import { onMounted, ref } from "vue";
    import { useSettingStore } from "../../stores/setting.js";
    import UploadFile from "@/components/UploadFile.vue";
    import Loading from "@/components/Loading.vue";

    export default {
        components: {Loading, UploadFile },
        data() {
            return {
                form: {
                    ip_address: '',
                    port: '',
                    logo: ''
                },
                clickLoad: false,
            };
        },
        setup() {
            const userStore = useSettingStore();

            onMounted(() => {
                userStore.fetchSetting();
            });

            return { userStore };
        },
        mounted() {
            setTimeout(() => {
                this.form.ip_address = this.userStore.getSetting.ip_address;
                this.form.port = this.userStore.getSetting.port;
            }, 1000)
        },
        methods: {
            async save() {
                let formData = new FormData();

                for (let key in this.form) {
                    await formData.append(key, this.form[key]);
                }

                this.clickLoad = true;
                await this.userStore.updateSetting(formData);
                await this.userStore.fetchSetting();
                this.clickLoad = false;
                await this.$toast.success('Yadda saxlanıldı');
            }
        },
    };
</script>
