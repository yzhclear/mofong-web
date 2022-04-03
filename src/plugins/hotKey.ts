import useHotkey from '@/hooks/useHotkey';
import { useStore } from 'vuex';
import { GlobalDataProps } from '@/store';
import { computed } from '@vue/runtime-core';
import { HotkeysEvent, KeyHandler } from 'hotkeys-js';

const wrap = (callback: KeyHandler) => {
  return (e: KeyboardEvent, event: HotkeysEvent) => {
    e.preventDefault();
    callback(e, event);
  };
};

export default function initHotKeys() {
  const store = useStore<GlobalDataProps>();
  const currentElement = computed(() => store.state.editor.currentElement);
  useHotkey('ctrl+c, command+c', () => {
    store.commit('copyComponent', currentElement.value);
  });
  useHotkey('ctrl+v, command+v', () => {
    store.commit('pasteCopiedComponent');
  });
  useHotkey('backspace, delete', () => {
    store.commit('deleteComponent', currentElement.value);
  });
  useHotkey('esc', () => {
    store.commit('setActive', '');
  });
  useHotkey(
    'up',
    wrap(() => {
      store.commit('moveComponent', { direction: 'Up', amount: 1, id: currentElement.value });
    }),
  );
  useHotkey(
    'down',
    wrap(() => {
      store.commit('moveComponent', { direction: 'Down', amount: 1, id: currentElement.value });
    }),
  );
  useHotkey(
    'left',
    wrap(() => {
      store.commit('moveComponent', { direction: 'Left', amount: 1, id: currentElement.value });
    }),
  );
  useHotkey(
    'right',
    wrap(() => {
      store.commit('moveComponent', { direction: 'Right', amount: 1, id: currentElement.value });
    }),
  );
}
