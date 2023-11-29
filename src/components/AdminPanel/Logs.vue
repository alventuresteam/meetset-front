<template>
  <a-space direction="horizontal" style="width: 100%; margin-bottom: 20px">
    <a-input-search
        v-model:value="searchTerm"
        placeholder="İstifadəçi axtar"
        style="width: 200px"
        @search="onSearch"
    />
    <a-date-picker v-model:value="valueDate" @change="changeDate" />
  </a-space>
  <a-space direction="vertical" style="width: 100%; margin-bottom: 20px">
    <a-table v-if="dataSources.length"
             :dataSource="dataSources"
             :pagination="pagination"
             :columns="columns"
             @change="handleTableChange"
    />
    <a-button type="primary" :size="size" @click="downloadSource" v-if="dataSources.length>0">
      <template #icon>
        <DownloadOutlined />
      </template>
      Excel Download
    </a-button>
  </a-space>


</template>
<script>
import {defineComponent, ref} from "vue";
import { usePagination } from 'vue-request';
import { DownloadOutlined } from '@ant-design/icons-vue';
import moment from "moment";
import {Moment} from "moment/moment";
import 'moment/dist/locale/tr';

export default defineComponent({

  components: [
    DownloadOutlined
  ],
  data: function () {
    let date = new Date();

    let formatDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    return {
      size: ref('large'),
      date: formatDate,
      searchTerm: '',
      valueDate: moment(formatDate, 'YYYY-MM-DD'),
      dataSources: [],
      page: 1,
      perPage: 10,
      pagination: {
        total: 10,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50'],
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
      },
      columns: [
        {
          title: "ID",
          dataIndex: "id",
          key: "id",
          width: '10%',
        },
        {
          title: "User",
          dataIndex: "user.name",
          key: "user.name",
          width: '30%',
        },
        {
          title: "Date",
          dataIndex: "created_at",
          key: "created_at",
          width: '30%',
        },
        {
          title: "Operation",
          dataIndex: "operation.name",
          key: "operation.name",
          width: '20%',
        },
      ],
    };
  },
  methods: {
    downloadSource() {
      window.open(`/api/logs/export?date=${this.date}&search_term=${this.searchTerm}`)
    },
    onSearch(searchValue) {
      this.searchTerm = searchValue;
      this.page = 1;
      this.perPage = 10;
      this.fetchData();
    },
    changeDate(date, dateString) {
      this.date = dateString;
      this.valueDate = moment(new Date(dateString), 'YYYY-MM-DD');
      this.page = 1;
      this.perPage = 10;
      this.fetchData();
    },
    fetchData() {
      fetch(`/api/logs?date=${this.date}&search_term=${this.searchTerm}&page=${this.page}&per_page=${this.perPage}`, {
        method: "GET",
        headers: {},
      })
          .then((response) => {
            response.json().then((data) => {
              this.pagination.total = data?.logs?.total;
              this.pagination.current = data?.logs?.current_page;
              this.pagination.pageSize = data?.logs?.per_page;

              let dataValues = [];

              if (data?.logs?.data) {
                data?.logs?.data.map(function (item) {
                  dataValues.push({
                    id: item.id,
                    user: item.user,
                    operation: item.operation,
                    created_at: new Date(item.created_at).toLocaleString(),
                  })
                })
              }

              this.dataSources = dataValues;
            });
          })
          .catch((err) => {
            console.error(err);
          });
    },
    handleTableChange(pag){
      this.page = pag.current;
      this.perPage = pag.pageSize;
      this.fetchData();
    }
  },
  mounted() {
    this.fetchData();
  }
});
</script>

