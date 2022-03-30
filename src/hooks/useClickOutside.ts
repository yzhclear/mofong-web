import { ref, onMounted, onUnmounted, Ref } from 'vue';

const useClickOutside = (elementRef: Ref<HTMLElement | null>) => {
  const isClickedOutside = ref(false);

  const handler = (e: MouseEvent) => {
    if (elementRef.value) {
      if (elementRef.value.contains(e.target as HTMLElement)) {
        isClickedOutside.value = false;
      } else {
        isClickedOutside.value = true;
      }
    }
  };

  onMounted(() => {
    document.addEventListener('click', handler);
  });

  onUnmounted(() => {
    document.removeEventListener('click', handler);
  });

  return isClickedOutside;
};

export default useClickOutside;
