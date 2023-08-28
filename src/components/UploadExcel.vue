<template>
  <div>
    <a :href="downloadExcel" style="text-decoration: none;"><div  class="down_excel">Şablonu yüklə</div> </a>
    <div class="uploadExcel">
      <input
        type="file"
        id="excel_file"
        accept=".xlsx, .xls"
        ref="uploadFile__excel"
        @input="uploadExcel"
      />

      <span>{{ fileName }}</span>

      <label for="excel_file">Yüklə</label>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileName: "İştirakçı siyahısını yükləyin (.xls)",
      downloadExcel:"https://meetset.al.ventures/template.xlsx"
    };
  },
  methods: {
    uploadExcel() {
      this.fileName = this.$refs.uploadFile__excel.files[0].name;
      this.$emit("file", this.$refs.uploadFile__excel.files[0]);
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
.down_excel {
  text-align: center;
  cursor: pointer;
  border: 1px solid #d8dce0;
  font-family: TTHoves-Medium, sans-serif;
  border-radius: 8px;
  padding: 10px 9px 10px 16px;
  margin-bottom: 30px;
  font-size: 16px;
  color: #121926;
  font-weight: 500;
  line-height: 20px;
}
.uploadExcel {
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
  label {
    padding: 9px 42px;
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    color: #1e293b;
    border-radius: 6px;
    cursor: pointer;
    background-color: #e2e8f0;
  }
}
</style>
