import { message } from 'ant-design-vue';
import { watch, computed } from 'vue';
import { useStore } from 'vuex';
import { GlobalDataProps } from '../store/index';

function useShowError() {
  const store = useStore<GlobalDataProps>();
  const error = computed(() => store.state.status.error);
  watch(
    () => error.value.status,
    (newVal) => {
      if (newVal) {
        message.error(error.value.message, 2);
      }
    },
  );
}

export default useShowError;
