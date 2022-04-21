import { computed, ref, ComputedRef } from 'vue';
import { useStore } from 'vuex';

interface LoadParams {
  pageIndex?: number;
  pageSize?: number;
  [key: string]: any;
}
const useLoadMore = (actionName: string, total: ComputedRef<number>, params: LoadParams = {}, pageSize = 8) => {
  const store = useStore();
  const pageIndex = ref((params && params.pageIndex) || 0);
  const requestParams = computed(() => {
    return {
      ...params,
      pageIndex: pageIndex.value + 1,
    };
  });

  const loadMorePage = () => {
    store.dispatch(actionName, requestParams.value).then(() => {
      pageIndex.value++;
    });
  };

  const isLastPage = computed(() => {
    return Math.ceil((total.value || 1) / pageSize) === pageIndex.value + 1;
  });

  return {
    loadMorePage,
    isLastPage,
  };
};

export default useLoadMore;
