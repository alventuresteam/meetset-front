<template>
  <div class="uploadFile">
    <input
      type="file"
      id="file"
      accept=".png, .jpeg, .gif, .svg"
      ref="uploadFile__file"
      @input="uploadFile"
    />

    <span>{{ fileName }}</span>

    <button type="button" @click="clickInput">Yüklə</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileName: "Şəkil yükləyin",
    };
  },
  methods: {
    uploadFile() {
      this.fileName = this.$refs.uploadFile__file.files[0].name;
      this.$emit("file", this.$refs.uploadFile__file.files[0]);
    },
    clickInput() {
      this.$refs.uploadFile__file.click();
    },
  },
  props: {
    selected: {
      type: String,
    },

  },
};
</script>

<style lang="scss" scoped>
.uploadFile {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 9px 10px 16px;
  border-radius: 8px;
  border: 1px solid #d8dce0;
  font-family: TTInterfaces-Regular, sans-serif;
  input {
    display: none;
  }
  span {
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    color: #697586;
  }
  button {
    padding: 9px 42px;
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    color: #1e293b;
    border-radius: 6px;
    cursor: pointer;
    border: 0;
    outline: 0;
    background-color: #e2e8f0;
  }
}
</style>
