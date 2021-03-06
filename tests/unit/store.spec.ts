import store from '@/store/index';
import { ComponentData, testComponents } from '@/store/editor';
import { TextComponentProps, textDefaultProps } from '@/defaultProps';
import { last, clone } from 'lodash-es';

export const testData = [
  {
    id: 1,
    coverImg: 'http://static-dev.imooc-lego.com/imooc-test/sZHlgv.png',
    title: '前端架构师直播海报',
    author: 'yzh',
    copiedCount: 1,
  },
  {
    id: 2,
    coverImg: 'http://static-dev.imooc-lego.com/imooc-test/sZHlgv.png',
    title: '前端架构师直播海报',
    author: 'yzh',
    copiedCount: 1,
  },
];
const cloneComponents = clone(testComponents);

const getLengthAndAssert = (length: number) => {
  expect(store.state.editor.components.length).toBe(length);
};
const getLastAndAssert = (id: string) => {
  const lastItem = last(store.state.editor.components);
  expect(lastItem?.id).toBe(id);
};
const getCurrentAndAssert = (text: string) => {
  const currentComponent: ComponentData = store.getters.getCurrentComponent;
  expect(currentComponent.props.text).toBe(text);
};

describe('test vuex store', () => {
  it('should have three modules', () => {
    expect(store.state).toHaveProperty('user');
    expect(store.state).toHaveProperty('templates');
    expect(store.state).toHaveProperty('editor');
  });
  describe('test user module', () => {
    it('test login mutation', () => {
      store.commit('login');
      expect(store.state.user.isLogin).toBeTruthy();
    });
    it('test logout mutation', () => {
      store.commit('logout');
      expect(store.state.user.isLogin).toBeFalsy();
    });
  });

  describe('test templates module', () => {
    it('should have default templates', () => {
      expect(store.state.templates.data).toHaveLength(testData.length);
    });
    it('should get the correct template by Id', () => {
      const selectTemplate = store.getters.getTemplateById(1);
      expect(selectTemplate.title).toBe('前端架构师直播海报');
    });
  });

  // -------- editor test ----------
  describe('test editor module', () => {
    it('should have default components', () => {
      expect(store.state.editor.components).toHaveLength(cloneComponents.length);
    });
    it('should get current component when set active one component', () => {
      store.commit('setActive', cloneComponents[0].id);
      expect(store.state.editor.currentElement).toBe(cloneComponents[0].id);
      const currentElement = store.getters.getCurrentComponent;
      expect(currentElement.id).toBe(cloneComponents[0].id);
    });
    it('add component should work fine', () => {
      const payload: ComponentData = {
        name: 'm-text',
        id: '1234',
        props: {
          text: 'text1',
        },
      };
      store.commit('addComponent', payload);
      expect(store.state.editor.components).toHaveLength(cloneComponents.length + 1);
      const lastItem = last(store.state.editor.components);
      if (lastItem) {
        expect(lastItem.props.text).toBe('text1');
        expect(lastItem.layerName).toBe('图层2');
      }
    });
    it('update component should work fine', () => {
      const newProps = {
        key: 'text',
        value: 'update text',
      };
      store.commit('updateComponentProps', newProps);
      const currentElement: ComponentData = store.getters.getCurrentComponent;
      expect(currentElement.props.text).toBe('update text');

      const newProps2 = {
        key: 'layerName',
        value: 'new layer',
        isRoot: true,
      };
      store.commit('updateComponentProps', newProps2);
      expect(currentElement.layerName).toBe('new layer');
    });
    it('copy & paste component should works fine', () => {
      store.commit('copyComponent', store.state.editor.currentElement);
      expect(store.state.editor.copiedComponent).toBeDefined();
      store.commit('pasteCopiedComponent');
      expect(store.state.editor.components).toHaveLength(cloneComponents.length + 2);
      const lastItem = last(store.state.editor.components);
      if (lastItem) {
        expect(lastItem.props).toEqual(cloneComponents[0].props);
      }
    });

    it('move component should works fine', () => {
      const currentElement = store.getters.getCurrentComponent as ComponentData;
      const oldLeftValue = parseInt(currentElement.props.left || '0');
      const oldTopValue = parseInt(currentElement.props.top || '0');
      store.commit('moveComponent', { direction: 'Left', amount: 5, id: currentElement.id });
      expect(currentElement.props.left).toBe(oldLeftValue - 5 + 'px');
      store.commit('moveComponent', { direction: 'Right', amount: 3, id: currentElement.id });
      expect(currentElement.props.left).toBe(oldLeftValue - 5 + 3 + 'px');
      store.commit('moveComponent', { direction: 'Up', amount: 5, id: currentElement.id });
      expect(currentElement.props.top).toBe(oldTopValue - 5 + 'px');
      store.commit('moveComponent', { direction: 'Down', amount: 3, id: currentElement.id });
      expect(currentElement.props.top).toBe(oldTopValue - 5 + 3 + 'px');
    });

    // undo
    it('undo should works fine', () => {
      store.commit('resetEditor');
      const payload: ComponentData = {
        name: 'm-text',
        id: '1234',
        props: {
          text: 'text1',
        },
      };
      store.commit('addComponent', payload);

      const payload2: ComponentData = {
        name: 'm-text',
        id: '2345',
        props: {
          text: 'text2',
        },
      };
      store.commit('addComponent', payload2);

      // delete
      store.commit('deleteComponent', '2345');
      // update
      store.commit('updateComponentProps', { key: 'text', value: 'update', id: '1234' });

      store.commit('setActive', '1234');
      getCurrentAndAssert('update');

      // undo step 1 (update backup)
      store.commit('undo');
      getCurrentAndAssert('text1');

      // undo step 2 (delete backup)
      getLengthAndAssert(1);
      store.commit('undo');
      getLengthAndAssert(2);
      getLastAndAssert('2345');

      // undo step3 (add backup)
      store.commit('undo');
      getLengthAndAssert(1);
      getLastAndAssert('1234');

      store.commit('undo');
      getLengthAndAssert(0);

      store.commit('redo');
      getLengthAndAssert(1);
      getLastAndAssert('1234');

      store.commit('redo');
      getLengthAndAssert(2);
      getLastAndAssert('2345');
    });
  });
});
