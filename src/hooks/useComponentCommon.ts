import { computed } from 'vue';
import { pick } from 'lodash-es';

const useComponentCommon = (props: { [key: string]: any }, picks: string[]) => {
  const styleProps = computed(() => pick(props, picks));
  const handleClick = () => {
    if (props.actionType === 'url' && props.url) {
      window.location.href = props.url;
    }
  };

  return {
    styleProps,
    handleClick,
  };
};

export default useComponentCommon;
