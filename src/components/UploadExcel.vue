<template>
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
  </template>
  
  <script>
  export default {
    data() {
      return {
        fileName: "İştirakçı siyahısını yükləyin (.xls)",
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
  