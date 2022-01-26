import { createStore } from 'vuex';
import templates, { TemplatesProps } from './templates';
import user, { UserProps } from './user';
import editor, { EditorDataProps } from './editor';

export interface GlobalDataProps {
  user: UserProps;
  templates: TemplatesProps;
  editor: EditorDataProps;
}

const store = createStore<GlobalDataProps>({
  modules: {
    templates,
    user,
    editor,
  },
});

export default store;
