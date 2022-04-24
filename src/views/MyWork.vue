<template>
  <div class="mywork-container">
    <a-modal title="数据统计" v-model:visible="showModal" width="700px" :footer="null">
      <a-range-picker :value="dateRange" @change="onDateChange" format="YYYY-MM-DD" />
      <div id="main-chart" :style="{ width: '600px', height: '400px' }">
        <a-spin v-if="loading" size="large" class="chart-loading" />
      </div>
      <a-table :columns="tableColumns" :data-source="tableData"> </a-table>
    </a-modal>
    <a-row type="flex" justify="space-between" align="middle" class="poster-title">
      <div v-if="currentSearchText" class="searchResult">
        <h2>{{ currentSearchText }}的结果</h2>
        <a-button shape="circle" size="small" :style="{ marginLeft: '10px' }" @click="clearSearch"> × </a-button>
      </div>
      <h2 v-else>我的作品和模板</h2>
      <a-input-search v-model:value="searchText" placeholder="搜索我的作品或者模版" @search="onSearch" />
    </a-row>
    <a-tabs @change="changeCategory">
      <a-tab-pane key="0" tab="我的作品"> </a-tab-pane>
      <a-tab-pane key="1" tab="我的模板"> </a-tab-pane>
    </a-tabs>

    <a-empty v-if="works.length === 0 && !loading">
      <template v-slot:description>
        <span> 还没有任何作品 </span>
      </template>
      <a-button type="primary" size="large" @click="createDesign"> 创建你的第一个设计 🎉 </a-button>
    </a-empty>

    <works-list :list="works" @on-delete="onDelete" @on-copy="onCopy" :loading="loading" @on-static="openStatic" @on-send="sendGift" :transfer-status="transferDone"> </works-list>
    <a-row type="flex" justify="center">
      <a-pagination v-model:current="currentPage" :total="total" :pageSize="8" show-less-items @change="pageChange" />
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref, nextTick } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import * as echarts from 'echarts';
import 'echarts/lib/chart/line';
import { GlobalDataProps } from '../store/index';
import WorksList from '../components/WorksList.vue';
import useCreateDesign from '../hooks/useCreateDesign';
import { toDateFormat, toDateFromDays, getDaysArray, objToArr } from '../helper';
import { message } from 'ant-design-vue';
export default defineComponent({
  components: {
    WorksList,
  },
  setup() {
    const store = useStore<GlobalDataProps>();
    const router = useRouter();
    const works = computed(() => store.state.works.works);
    const total = computed(() => store.state.works.totalWorks);
    const loading = computed(() => store.state.status.loading);
    const currentPage = ref(1);

    // ------ echarts 配置 -------
    const statics = computed(() => store.state.works.statics);
    const staticOptions = computed(() => {
      const legend = statics.value.map((stat) => stat.name);
      const xAxis = {
        type: 'category',
        data: dateArrayFormat,
      };
      const series = statics.value.map((stat) => {
        const statMap = {} as any;
        stat.list.forEach((i) => {
          const key = i.eventDate.split('T')[0];
          statMap[key] = i.eventData.pv;
        });
        const dateArrayFormatMap = {} as any;
        dateArrayFormat.forEach((date) => {
          if (statMap[date]) {
            dateArrayFormatMap[date] = statMap[date];
          } else {
            dateArrayFormatMap[date] = 0;
          }
        });
        return {
          type: 'line',
          name: stat.name,
          data: objToArr(dateArrayFormatMap),
        };
      });
      return {
        legend: {
          data: legend,
        },
        xAxis,
        yAxis: {
          type: 'value',
        },
        series,
      };
    });
    const tableColumns = [
      {
        title: '渠道名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'PV',
        dataIndex: 'pv',
        key: 'pv',
      },
      {
        title: '占比',
        dataIndex: 'percent',
        key: 'percent',
      },
    ];
    const totalPv = computed(() => {
      let total = 0;
      statics.value.forEach((stat) => {
        const pv = stat.list.reduce((prev, current) => current.eventData.pv + prev, 0);
        total += pv;
      });
      return total;
    });
    const tableData = computed(() => {
      return statics.value.map((stat) => {
        const pv = stat.list.reduce((prev, current) => current.eventData.pv + prev, 0);
        return {
          name: stat.name,
          key: stat.id,
          pv,
          percent: (pv / totalPv.value) * 100 + '%',
        };
      });
    });

    onMounted(() => {
      store.dispatch('fetchWorks');
    });

    // ------ 作品相关操作 ------
    const searchText = ref('');
    const showModal = ref(false);
    const isTemplate = ref(0);
    const transferDone = ref(false);
    const currentSearchText = computed(() => store.state.works.searchText);
    const createDesign = useCreateDesign();
    const onSearch = () => {
      const title = searchText.value.trim();
      if (title !== '') {
        store.dispatch('fetchWorks', { title, pageIndex: 0, pageSize: 8, isTemplate: isTemplate.value });
      }
    };
    const clearSearch = () => {
      store.dispatch('fetchWorks', { title: '', pageIndex: 0, pageSize: 8, isTemplate: isTemplate.value });
    };
    const onDelete = (id: number) => {
      store.dispatch('deleteWork', id);
    };
    const onCopy = (id: number) => {
      store.dispatch('copyWork', id).then(({ data }) => {
        router.push(`/editor/${data.id}`);
      });
    };
    const sendGift = (data: { id: number; username: string }) => {
      store.dispatch('transferWork', data).then((data) => {
        console.log(data);
        if (data.errno !== 0) {
          message.error(data.message);
        } else {
          message.success('转赠作品成功');
          transferDone.value = true;
        }
      });
    };
    // 切换作品与模板
    const changeCategory = (key: any) => {
      isTemplate.value = key;
      currentPage.value = 1;
      nextTick(() => {
        store.dispatch('fetchWorks', { title: '', pageIndex: currentPage.value - 1, pageSize: 8, isTemplate: isTemplate.value });
      });
    };
    const pageChange = () => {
      store.dispatch('fetchWorks', { title: currentSearchText.value, pageIndex: currentPage.value - 1, pageSize: 8, isTemplate: isTemplate.value });
    };

    // ------- 渠道统计数据相关 --------
    const currentStaticId = ref(0);
    const channels = computed(() => store.state.editor.channels);
    const dateRange = ref([toDateFormat(toDateFromDays(new Date(), -30)), toDateFormat(new Date())]);
    const dateArray = computed(() => getDaysArray(new Date(dateRange.value[0]), new Date(dateRange.value[1])));
    const dateArrayFormat = dateArray.value.map((date) => toDateFormat(date));
    let myChart: any;
    const getChannelStatic = (id: number) => {
      store.commit('clearStatic');
      store
        .dispatch('fetchChannels', id)
        .then(() => {
          const promiseArr = channels.value.map((channel) => {
            return store.dispatch('fetchStatic', {
              name: channel.name,
              label: id,
              value: channel.id,
              startDate: dateRange.value[0],
              endDate: dateRange.value[1],
            });
          });
          return Promise.all(promiseArr);
        })
        .then(() => {
          if (!myChart) {
            myChart = echarts.init(document.getElementById('main-chart') as HTMLDivElement);
          }
          myChart.clear();
          myChart.setOption(staticOptions.value);
        });
    };
    const openStatic = (id: number) => {
      // showModal.value = true;
      // currentStaticId.value = id;
      // getChannelStatic(id);
    };
    const onDateChange = (newDate: string, dateString: string) => {
      dateRange.value[0] = dateString[0];
      dateRange.value[1] = dateString[1];
      getChannelStatic(currentStaticId.value);
    };

    return {
      works,
      onDelete,
      onCopy,
      createDesign,
      loading,
      searchText,
      currentSearchText,
      onSearch,
      clearSearch,
      openStatic,
      showModal,
      onDateChange,
      dateRange,
      tableData,
      tableColumns,
      total,
      currentPage,
      pageChange,
      changeCategory,
      sendGift,
      transferDone,
    };
  },
});
</script>

<style>
.mywork-container {
  margin: 100px auto 0 auto;
  width: 60%;
}
.mywork-container .ant-input-search {
  width: 30%;
}
.searchResult {
  display: flex;
  align-items: center;
}
#main-chart {
  position: relative;
}
.chart-loading {
  position: absolute;
  left: 50%;
  top: 50%;
}
</style>
